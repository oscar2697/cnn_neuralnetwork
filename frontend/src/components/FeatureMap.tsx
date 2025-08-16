import { getColor } from "~/lib/colors"

const FeatureMap = ({
    data,
    title,
    internal,
    spectogram,
}: {
    data: number[][],
    title: string,
    internal?: boolean,
    spectogram?: boolean,
}) => {
    if (!data?.length || !data[0]?.length) return null

    const mapHeight = data.length
    const mapWidth = data[0].length

    const absMax = data
        .flat()
        .reduce((acc, val) => Math.max(acc, Math.abs(val ?? 0)), 0)

    return (
        <div className="w-full text-center">
            <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                preserveAspectRatio="none"
                className={`mx-auto block rounded-2xl shadow-md border border-stone-300 
          ${internal ? "w-full max-w-32" : spectogram ? "w-full object-contain" : "w-full max-w-[500px] max-h-[220px] object-contain"}`}
            >
                {data.flatMap((row, i) =>
                    row.map((value, j) => {
                        const normalizedValues = absMax === 0 ? 0 : value / absMax
                        const [r, g, b] = getColor(normalizedValues)

                        return (
                            <rect
                                key={`${i}-${j}`}
                                x={j}
                                y={i}
                                width={1}
                                height={1}
                                fill={`rgb(${r}, ${g}, ${b})`}
                            />
                        )
                    }),
                )}
            </svg>

            <h2 className="mt-3 text-base font-semibold text-stone-700 tracking-wide">
                {title}
            </h2>
            <p className="mt-1 text-sm text-stone-500 italic">
                Visual representation of extracted features
            </p>
        </div>
    )
}

export default FeatureMap
