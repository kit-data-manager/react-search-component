import { DateTime, Duration } from "luxon"

export class DateRangeBuilder {
    static dateYears() {
        const getDate = (minus: number) =>
            DateTime.now()
                .minus(Duration.fromObject({ years: minus }))
                .toFormat("yyyy")

        return [
            {
                from: DateTime.now().toFormat("yyyy"),
                name: "This Year"
            },
            {
                from: getDate(2),
                to: getDate(1),
                name: "Last Year"
            },
            {
                from: getDate(3),
                to: getDate(2),
                name: "2 years ago"
            },
            {
                from: getDate(4),
                to: getDate(3),
                name: "3 years ago"
            },
            {
                from: getDate(5),
                to: getDate(4),
                name: "4 years ago"
            },
            {
                from: getDate(6),
                to: getDate(5),
                name: "5 years ago"
            },
            {
                from: getDate(10),
                to: getDate(6),
                name: "6 - 10 years ago"
            },
            {
                to: getDate(11),
                name: "Older"
            }
        ]
    }

    static dateTimes() {
        const format = (d: DateTime<true>) => d.toISO({ extendedZone: false })
        return this.rawDateTime(format)
    }

    static dateTimesNoMillis() {
        const format = (d: DateTime<true>) => d.startOf("second").toISO({ extendedZone: false, suppressMilliseconds: true })
        return this.rawDateTime(format)
    }

    private static rawDateTime(format: (d: DateTime<true>) => string) {
        return [
            {
                from: format(DateTime.now()),
                to: format(DateTime.now().minus(Duration.fromObject({ days: 7 }))),
                name: "Last 7 Days"
            },
            {
                from: format(DateTime.now()),
                to: format(DateTime.now().minus(Duration.fromObject({ weeks: 4 }))),
                name: "Last 4 Weeks"
            },
            {
                from: format(DateTime.now().startOf("year")),
                to: format(DateTime.now().endOf("year")),
                name: "This Year"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 1 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 1 }))
                        .endOf("year")
                ),
                name: "Last Year"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 2 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 2 }))
                        .endOf("year")
                ),
                name: "2 years ago"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 3 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 3 }))
                        .endOf("year")
                ),
                name: "3 years ago"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 4 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 4 }))
                        .endOf("year")
                ),
                name: "4 years ago"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 5 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 5 }))
                        .endOf("year")
                ),
                name: "5 years ago"
            },
            {
                from: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 10 }))
                        .startOf("year")
                ),
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 6 }))
                        .endOf("year")
                ),
                name: "6 - 10 years ago"
            },
            {
                to: format(
                    DateTime.now()
                        .minus(Duration.fromObject({ years: 11 }))
                        .endOf("year")
                ),
                name: "Older"
            }
        ]
    }
}
