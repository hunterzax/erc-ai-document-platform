import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"
import { Save, Settings } from "lucide-react"

export function AIConfigModal({ mode }: any) {
    const [maxToken, setMaxToken] = useState(1000)
    const [temperature, setTemperature] = useState(0.7)
    const [topP, setTopP] = useState(0.9)
    const [topK, setTopK] = useState(50)
    const [repetitionPenalty, setRepetitionPenalty] = useState(1.0)

    let modeForm: any = mode ? mode : 'dialog';

    const validate = () => {
        if (maxToken < 1) {
            toast.error("Max Token ต้องไม่น้อยกว่า 1")
            return false
        }
        if (temperature < 0 || temperature > 2) {
            toast.error("Temperature ต้องอยู่ระหว่าง 0 - 2")
            return false
        }
        if (topP < 0 || topP > 1) {
            toast.error("Top-P ต้องอยู่ระหว่าง 0 - 1")
            return false
        }
        if (topK < 0) {
            toast.error("Top-K ต้องมากกว่าหรือเท่ากับ 0")
            return false
        }
        if (repetitionPenalty < 0) {
            toast.error("Repetition Penalty ต้องมากกว่าหรือเท่ากับ 0")
            return false
        }
        return true
    }

    const handleSave = () => {
        if (!validate()) return
        // TODO: save config logic
        toast.success("บันทึก Configuration AI เรียบร้อยแล้ว!", {
            position: "bottom-right",
            autoClose: 3000,
        })
    }

    return (
        modeForm == "dialog" ?
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="rounded-lg px-4 py-2">
                        <Settings />
                        {/* Configuration */}
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Configuration</DialogTitle>
                        <DialogDescription>
                            ปรับแต่งพารามิเตอร์สำหรับโมเดล AI
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="max-token">Max Token</Label>
                            <Input
                                id="max-token"
                                type="number"
                                min={1}
                                value={maxToken}
                                onChange={(e) => setMaxToken(Number(e.target.value))}
                                className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="temperature">Temperature</Label>
                            <Input
                                id="temperature"
                                type="number"
                                step={0.1}
                                min={0}
                                max={2}
                                value={temperature}
                                onChange={(e) => setTemperature(Number(e.target.value))}
                                className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="top-p">Top-P</Label>
                            <Input
                                id="top-p"
                                type="number"
                                step={0.01}
                                min={0}
                                max={1}
                                value={topP}
                                onChange={(e) => setTopP(Number(e.target.value))}
                                className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* <div className="space-y-1">
                        <Label htmlFor="top-k">Top-K</Label>
                        <Input
                            id="top-k"
                            type="number"
                            min={0}
                            value={topK}
                            onChange={(e) => setTopK(Number(e.target.value))}
                            className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div> */}

                        <div className="space-y-1">
                            <Label htmlFor="repetition-penalty">Repetition Penalty</Label>
                            <Input
                                id="repetition-penalty"
                                type="number"
                                step={0.1}
                                min={0}
                                value={repetitionPenalty}
                                onChange={(e) => setRepetitionPenalty(Number(e.target.value))}
                                className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => console.log("Cancel")}>
                            ยกเลิก
                        </Button>
                        <Button onClick={handleSave}>บันทึก</Button>
                    </div>
                </DialogContent>
            </Dialog>
            :
            <div className="grid gap-4 py-2">
                <div className="space-y-1">
                    <Label htmlFor="max-token">Max Token</Label>
                    <Input
                        id="max-token"
                        type="number"
                        min={1}
                        value={maxToken}
                        onChange={(e) => setMaxToken(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                        id="temperature"
                        type="number"
                        step={0.1}
                        min={0}
                        max={2}
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="top-p">Top-P</Label>
                    <Input
                        id="top-p"
                        type="number"
                        step={0.01}
                        min={0}
                        max={1}
                        value={topP}
                        onChange={(e) => setTopP(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* <div className="space-y-1">
                        <Label htmlFor="top-k">Top-K</Label>
                        <Input
                            id="top-k"
                            type="number"
                            min={0}
                            value={topK}
                            onChange={(e) => setTopK(Number(e.target.value))}
                            className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div> */}

                <div className="space-y-1">
                    <Label htmlFor="repetition-penalty">Repetition Penalty</Label>
                    <Input
                        id="repetition-penalty"
                        type="number"
                        step={0.1}
                        min={0}
                        value={repetitionPenalty}
                        onChange={(e) => setRepetitionPenalty(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button onClick={handleSave} className="w-full">
                        <Save />
                        บันทึก
                    </Button>
                </div>
            </div>
    )
}

