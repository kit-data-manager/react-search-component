import useSWR from "swr"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, ReferenceArea, XAxis, YAxis } from "recharts"
import { z } from "zod"
import { DateTime } from "luxon"

const response = z.object({
    aggregations: z.object({
        documents_over_time: z.object({
            buckets: z.array(
                z.object({
                    key_as_string: z.string(),
                    key: z.number(),
                    doc_count: z.number()
                })
            )
        })
    })
})

async function fetchHistogram(path: string) {
    const req = await fetch(path, {
        headers: {
            Authorization: `ApiKey VG9NNFNwUUJyWWdtamJ6UGExcjY6aXhKUkk1M0xTT1dTS2xzN3daQjA3UQ==`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            size: 0,
            aggs: {
                documents_over_time: {
                    date_histogram: {
                        field: "timestamp",
                        calendar_interval: "month"
                    }
                }
            }
        }),
        method: "POST"
    })
    return req.json()
}

const chartConfig = { key_as_string: { label: "Timestamp", color: "#2563eb" } }

export function Histogram() {
    const { data, error } = useSWR("https://ddaa9283-f114-4496-b6ed-af12ee34b107.ka.bw-cloud-instance.org:9200/fdo-test-3/_search", fetchHistogram)

    const chartData = useMemo(() => {
        try {
            const parsed = response.parse(data)
            const values = parsed.aggregations.documents_over_time.buckets
            return values.map((val, i) => ({ ...val, key_as_string: DateTime.fromISO(val.key_as_string).toLocaleString(), index: i }))
        } catch (e) {
            console.log("parse error", e)
            return []
        }
    }, [data])

    const initialChartData = useRef<typeof chartData>([])
    useEffect(() => {
        if (initialChartData.current?.length === 0 && chartData?.length !== 0) {
            initialChartData.current = chartData
        }
    }, [chartData])

    const [left, setLeft] = useState<string | number>("dataMin")
    const [right, setRight] = useState<string | number>("dataMax")
    const [refAreaLeft, setRefAreaLeft] = useState<"" | number>("")
    const [refAreaRight, setRefAreaRight] = useState<"" | number>("")
    const [top, setTop] = useState<string | number>("dataMax")
    const [bottom, setBottom] = useState<string | number>("dataMin")

    const getAxisYDomain = useCallback((from: number, to: number, ref: keyof (typeof chartData)[0], offset: number) => {
        if (!initialChartData.current) return [0, 0]
        const refData = initialChartData.current.slice(from - 1, to)
        let [bottom, top] = [refData[0][ref], refData[0][ref]]
        refData.forEach((d) => {
            if (d[ref] > top) top = d[ref]
            if (d[ref] < bottom) bottom = d[ref]
        })

        return [(bottom as number | 0) - offset, (top as number | 0) + offset]
    }, [])

    const zoom = useCallback(() => {
        console.log(refAreaLeft, refAreaRight)
        if (refAreaLeft === refAreaRight || refAreaRight === "" || refAreaLeft === "") {
            setRefAreaLeft("")
            setRefAreaRight("")
            return
        }

        let [_refAreaLeft, _refAreaRight] = [refAreaLeft, refAreaRight]

        // xAxis domain
        if (_refAreaLeft > _refAreaRight) {
            const tmp = _refAreaLeft
            _refAreaLeft = _refAreaRight
            _refAreaRight = tmp
        }

        // yAxis domain
        const [bottom, top] = getAxisYDomain(_refAreaLeft, _refAreaRight, "doc_count", 1)

        setLeft(_refAreaLeft)
        setRight(_refAreaRight)
        setBottom(bottom)
        setTop(top)
        setRefAreaLeft("")
        setRefAreaRight("")
    }, [getAxisYDomain, refAreaLeft, refAreaRight])

    return (
        <div className="rfs-w-full rfs-h-72">
            {chartData.length > 0 && (
                <ChartContainer config={chartConfig} className="rfs-w-full rfs-h-72">
                    <BarChart
                        data={chartData}
                        onMouseDown={(e) => setRefAreaLeft(typeof e.activeLabel === "number" ? e.activeLabel : "")}
                        onMouseMove={(e) => (refAreaLeft ? setRefAreaRight(typeof e.activeLabel === "number" ? e.activeLabel : "") : "")}
                        onMouseUp={() => zoom()}
                    >
                        <XAxis
                            dataKey="index"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            domain={[left, right]}
                            allowDataOverflow
                            type={"number"}
                            visibility={"hidden"}
                            tickFormatter={(_, i) => chartData[i].key_as_string}
                        />
                        <YAxis allowDataOverflow dataKey={"doc_count"} domain={[bottom, top]} yAxisId={"1"} type={"number"} />

                        <ChartTooltip content={<ChartTooltipContent />} />
                        <CartesianGrid vertical={false} />
                        <Bar dataKey="doc_count" radius={4} fill="hsl(var(--rfs-primary))" yAxisId={"1"} animationDuration={500} />

                        {refAreaLeft && refAreaRight ? <ReferenceArea yAxisId={"1"} x1={refAreaLeft} x2={refAreaRight} strokeOpacity={1} /> : null}
                    </BarChart>
                </ChartContainer>
            )}
        </div>
    )
}
