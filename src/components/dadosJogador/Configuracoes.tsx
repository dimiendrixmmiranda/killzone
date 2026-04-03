import { Jogador } from "@/src/domain/Jogador"
import { titulo } from "@/src/utils/titulo"
import { FaCopy } from "react-icons/fa6"


interface ConfiguracoesProps {
    jogador: Jogador
}
export default function Configuracoes({ jogador }: ConfiguracoesProps) {
    return (
        <div className="flex flex-col gap-4">
            {
                titulo('Configurações')
            }
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Mouse Settings</h3>
                {
                    jogador.mouseSettings ? (
                        <ul className="grid gap-2 md:grid-cols-3">
                            <li className="flex items-center gap-1">
                                <p className="font-bold">DPI:</p>
                                <span>{jogador.mouseSettings?.dpi}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Sensitivity:</p>
                                <span>{jogador.mouseSettings?.sensitivity}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">HZ:</p>
                                <span>{jogador.mouseSettings?.hz}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Zoon Sensitivity:</p>
                                <span>{jogador.mouseSettings?.zoomSensitivity}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Windows Sensitivity:</p>
                                <span>{jogador.mouseSettings?.windowsSensitivity}</span>
                            </li>
                        </ul>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Video Settings</h3>
                {
                    jogador.videoSettings ? (
                        <ul className="grid gap-2 md:grid-cols-3">
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Resolution:</p>
                                <span>{jogador.videoSettings?.resolution}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Aspectio Ratio:</p>
                                <span>{jogador.videoSettings?.aspectRatio}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Scaling Mode:</p>
                                <span>{jogador.videoSettings?.scalingMode}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Display Mode:</p>
                                <span>{jogador.videoSettings?.displayMode}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Brightness:</p>
                                <span>{jogador.videoSettings?.brightness}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Refresh Rate:</p>
                                <span>{jogador.videoSettings?.refreshRate}</span>
                            </li>
                        </ul>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Crosshair Codes</h3>
                {
                    jogador.crosshairCodes ? (
                        <ul className="grid gap-2 md:grid-cols-2">
                            {
                                jogador.crosshairCodes?.map((code, i) => {
                                    return (
                                        <li key={i} className="flex items-center gap-2">
                                            <p>{code}</p>
                                            <button><FaCopy /></button>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">View Model</h3>
                {
                    jogador.viewmodel ? (
                        <div className="flex items-center gap-2">
                            <p>{jogador.viewmodel}</p>
                            <button><FaCopy /></button>
                        </div>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Hud</h3>
                {
                    jogador.hud ? (
                        <div className="flex items-center gap-2">
                            <p>{jogador.hud}</p>
                            <button><FaCopy /></button>
                        </div>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Radar</h3>
                {
                    jogador.radar ? (
                        <div className="flex items-center gap-2">
                            <p>{jogador.radar}</p>
                            <button><FaCopy /></button>
                        </div>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Lounch Options</h3>
                {
                    jogador.lounchOptions ? (
                        <div className="flex items-center gap-2">
                            <p>{jogador.lounchOptions}</p>
                            <button><FaCopy /></button>
                        </div>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold">Advanced Settings</h3>
                {
                    jogador.advancedSettings ? (
                        <ul className="grid gap-2 md:grid-cols-2">
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Boost Player Contrast:</p>
                                <span>{jogador.advancedSettings?.boostPlayerContrast}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Wait for Vertical Sync:</p>
                                <span>{jogador.advancedSettings?.waitForVerticalSync}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">NVIDIA G-Sync:</p>
                                <span>{jogador.advancedSettings?.NVIDIAGSync}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">NVIDIA Reflex Low Latency:</p>
                                <span>{jogador.advancedSettings?.NVIDIAReflexLowLatency}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Max FPS in Game:</p>
                                <span>{jogador.advancedSettings?.maxFPSinGame}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Multisampling:</p>
                                <span>{jogador.advancedSettings?.multisampling}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Global Shadow Quality:</p>
                                <span>{jogador.advancedSettings?.globalShadowQuality}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Dynamic Shadows:</p>
                                <span>{jogador.advancedSettings?.dynamicShadows}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Model / Texture Detail:</p>
                                <span>{jogador.advancedSettings?.modelTextureDetail}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Texture Filtering Mode:</p>
                                <span>{jogador.advancedSettings?.textureFilteringMode}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Shader Detail:</p>
                                <span>{jogador.advancedSettings?.shaderDetail}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Particle Detail:</p>
                                <span>{jogador.advancedSettings?.particleDetail}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Ambient Occlusion:</p>
                                <span>{jogador.advancedSettings?.ambientOcclusion}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">High Dynamic Range:</p>
                                <span>{jogador.advancedSettings?.highDynamicRange}</span>
                            </li>
                            <li className="flex items-center gap-1">
                                <p className="font-bold">Fidelity FX Super Resolution:</p>
                                <span>{jogador.advancedSettings?.fidelityFXSuperResolution}</span>
                            </li>
                        </ul>
                    ) : (
                        <div>
                            <h2>Sem Informações</h2>
                        </div>
                    )
                }
            </div>
        </div>
    )
}