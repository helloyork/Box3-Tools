(function (d) {
    d[0]("l")
        .then(v =>
            d[2][d[1](
                v.concat(
                    (new Array(2).fill(null))
                        .map((v, i) => ["o", "g"][i])
                        .join(""))
            )]
                ("hello world")
        )
})([
    (function (c) {
        return new Promise(function (r) {
            r.apply(
                (r.this =
                    (function () {
                        return this ? this : null
                    })(),
                    r.this ?? null),
                [...Array.from(
                    [...(r.set = new Set(), r.set.add(c), r.set.values())][0]
                )
                ]
            )
        })
    }),
    (function () {
        return (arguments.length ? arguments[0] :
            (arguments[0] = console ? console :
                Array.from(
                    (arguments.s = new Set(),
                        arguments.s.add(console),
                        arguments.s.values())
                ),
                arguments[0]),
            arguments[0]
        )
    }),
    console]
)