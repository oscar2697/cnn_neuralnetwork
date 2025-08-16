'use client'

import { useState } from "react";
import ColorScale from "~/components/ColorScale";
import FeatureMap from "~/components/FeatureMap";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import Waveform from "~/components/Waveform";
import { ESC50_EMOJI_MAP } from "~/lib/emoji";
import type { ApiResponse, LayerData, VizualizationData } from "~/lib/types";

const getEmojiForClass = (className: string): string => {
  return ESC50_EMOJI_MAP[className] ?? '📢'
}

function splitLayers(visualization: VizualizationData) {
  const main: [string, LayerData][] = []
  const internals: Record<string, [string, LayerData][]> = {}

  for (const [name, data] of Object.entries(visualization)) {
    if (!name.includes('.')) {
      main.push([name, data])
    } else {
      const [parent] = name.split('.')

      if (parent === undefined) continue
      internals[parent] ??= []

      internals[parent]?.push([name, data])
    }
  }

  return { main, internals }
}

export default function HomePage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setFileName(file.name)
    setIsLoading(true)
    setError(null)
    setVizData(null)

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async () => {
      const arrayBuffer = reader.result
      if (!(arrayBuffer instanceof ArrayBuffer)) {
        setError('Failed to read file as ArrayBuffer')
        setIsLoading(false)
        return
      }

      try {
        const base64String = btoa(new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '',))

        const response = await fetch('https://oscar2697--audio-cnn-audioclassifier-inference.modal.run/',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audio_data: base64String })
          }
        )

        if (!response.ok) {
          throw new Error(`Api Error ${response.statusText}`)
        }

        const data = await response.json() as ApiResponse
        setVizData(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occured.')
      } finally {
        setIsLoading(false)
      }
    }

    reader.onerror = () => {
      setError('Failed on read the File.')
    }
  }

  const { main, internals } = vizData ? splitLayers(vizData?.visualizations) : { main: [], internals: {} }

  return (
    <main className="flex min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-8 text-gray-100">
      <div className="mx-auto max-w-[100%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-wide text-gray-100">
            From Data to Discovery
          </h1>

          <p className="text-md mb-8 text-gray-400">
            Visualize predictions, spectrograms, and waveforms with clarity.
            Turn raw numbers into knowledge you can see and explore.
          </p>

          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <input
                type="file"
                accept=".wav"
                id="file-upload"
                onChange={handleChange}
                disabled={isLoading}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />

              <Button
                disabled={isLoading}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
                variant="outline"
                size="lg"
              >
                {isLoading ? "Loading..." : "Choose a WAV file"}
              </Button>
            </div>

            {true && (
              <Badge
                variant="secondary"
                className="mt-4 bg-gray-700 text-gray-200 border border-gray-600"
              >
                {fileName}
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-8 border-red-500 bg-red-900/40">
            <CardContent>
              <p className="text-red-400">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {vizData && (
          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-800 shadow-lg shadow-gray-900/40">
              <CardHeader>
                <CardTitle className="text-gray-100">Top Predictions</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {vizData.predictions.slice(0, 3).map((pred, i) => (
                    <div key={pred.class} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-md font-medium text-gray-300">
                          {getEmojiForClass(pred.class)}{" "}
                          <span>{pred.class.replaceAll("_", " ")}</span>
                        </div>

                        <Badge
                          variant={i === 0 ? "default" : "secondary"}
                          className={
                            i === 0
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-700 text-gray-300 border border-gray-600"
                          }
                        >
                          {(pred.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>

                      <Progress
                        value={pred.confidence * 100}
                        className="h-2 bg-gray-800 [&>div]:bg-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-100">Input Spectrogram</CardTitle>
                </CardHeader>

                <CardContent>
                  <FeatureMap
                    data={vizData.input_spectogram.values}
                    title={`${vizData.input_spectogram.shape.join(" x ")}`}
                    spectogram
                  />

                  <div className="mt-5 flex justify-end">
                    <ColorScale width={200} height={16} min={-1} max={1} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 shadow-md">
                <CardHeader>
                  <CardTitle className="text-gray-100">Audio Waveform</CardTitle>
                </CardHeader>

                <CardContent>
                  <Waveform
                    data={vizData.waveform.values}
                    title={`${vizData.waveform.duration.toFixed(
                      2
                    )}s * ${vizData.waveform.sample_rate}Hz`}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-100">
                  Convolutional Layer Outputs
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  {main.map(([mainName, mainData]) => (
                    <div key={mainName} className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium text-gray-300">
                          {mainName}
                        </h4>

                        <FeatureMap
                          data={mainData.values}
                          title={`${mainData.shape.join(" x ")}`}
                        />
                      </div>

                      {internals[mainName] && (
                        <div className="h-80 overflow-y-auto rounded border border-gray-700 bg-gray-800/60 p-2">
                          <div className="space-y-2">
                            {internals[mainName]
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([layerName, layerData]) => (
                                <FeatureMap
                                  key={layerName}
                                  data={layerData.values}
                                  title={layerName.replace(`${mainName}.`, "")}
                                  internal={true}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-end">
                  <ColorScale width={200} height={16} min={-1} max={1} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
