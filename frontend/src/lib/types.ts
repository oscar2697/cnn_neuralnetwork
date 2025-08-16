interface Prediction {
    class: string
    confidence: number
}

interface LayerData {
    shape: number[]
    values: number[][]
}

type VizualizationData = Record<string, LayerData>

interface WaveformData {
    values: number[]
    sample_rate: number
    duration: number
}

interface ApiResponse {
    predictions: Prediction[]
    visualizations: VizualizationData
    input_spectogram: LayerData
    waveform: WaveformData
}

export type {
    Prediction,
    LayerData,
    VizualizationData,
    WaveformData,
    ApiResponse
}