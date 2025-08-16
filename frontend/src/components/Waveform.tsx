const Waveform = ({ data, title }: { data: number[], title: string }) => {
    if (!data || data.length === 0) return null

    const width = 600
    const height = 300
    const centerY = height / 2

    const validData = data.filter((val) => !isNaN(val) && isFinite(val))

    if (validData.length === 0) return null

    const min = Math.min(...validData)
    const max = Math.max(...validData)
    const range = max - min
    const scaleY = height * 0.45

    const pathData = validData.map((sample, i) => {
        const x = (i / (validData.length - 1)) * width
        let y = centerY

        if (range > 0) {
            const normalizedSample = (sample - min) / range
            y = centerY - (normalizedSample - 0.5) * 2 * scaleY
        }

        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    }).join(' ')

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex flex-1 items-center justify-center">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="block max-h-[300px] max-w-full rounded border border-stone-200 shadow-md"
                >
                    <path
                        d={`M 0 ${centerY} H ${width}`}
                        stroke="#d6d3d1"
                        strokeWidth="1"
                    />

                    <path
                        d={pathData}
                        fill="none"
                        stroke="#2563eb"   // Azul llamativo
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <p className="mt-3 text-center text-sm font-medium text-stone-500">
                🎵 Waveform Preview: <span className="text-stone-100">{title}</span>
            </p>
        </div>
    )
}

export default Waveform
