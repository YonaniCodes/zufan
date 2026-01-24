"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Upload, X, File as FileIcon, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
// import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"

const formSchema = z.object({
    jurisdiction: z.string().min(1, "Please select a jurisdiction"),
    caseReferenceId: z.string().min(1, "Case reference ID is required"),
    documentType: z.string().min(1, "Please select a document type"),
})

export function UploadZone() {
    const [file, setFile] = React.useState<File | null>(null)
    const [progress, setProgress] = React.useState(0)
    const [isUploading, setIsUploading] = React.useState(false)
    // const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            jurisdiction: "",
            caseReferenceId: "",
            documentType: "",
        },
    })

    const onDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) {
            setFile(droppedFile)
        }
    }, [])

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const onSubmit = async () => {
        if (!file) {
            toast.error("No file selected", {
                description: "Please select a file to upload.",
            })
            return
        }

        setIsUploading(true)
        setProgress(0)

        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 10
            })
        }, 200)

        setTimeout(() => {
            clearInterval(interval)
            setProgress(100)
            setIsUploading(false)
            toast.success("Upload Successful", {
                description: `Document ${file.name} indexed successfully.`,
            })
            setFile(null)
            form.reset()
        }, 2500)
    }

    return (
        <div className="grid gap-4 w-full md:grid-cols-2">
            <Card
                className={`border-dashed border-2 transition-colors ${file ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.txt"
                    />
                    {file ? (
                        <div className="flex flex-col items-center gap-2">
                            <FileIcon className="h-10 w-10 text-primary" />
                            <p className="font-medium">{file?.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {file ? (file.size / 1024 / 1024).toFixed(2) : "0"} MB
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFile(null)}
                                className="mt-2 text-destructive hover:text-destructive"
                            >
                                <X className="mr-2 h-4 w-4" /> Remove
                            </Button>
                        </div>
                    ) : (
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center cursor-pointer"
                        >
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold text-lg">Upload Legal Document</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                PDF, DOCX, TXT (Max 50MB)
                            </p>
                        </label>
                    )}
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Metadata & Indexing</CardTitle>
                    <CardDescription>
                        Add legal context to improve RAG retrieval accuracy.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="jurisdiction"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Jurisdiction</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select jurisdiction" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="us-federal">US Federal</SelectItem>
                                                <SelectItem value="eu-gdpr">EU (GDPR)</SelectItem>
                                                <SelectItem value="uk-law">UK Common Law</SelectItem>
                                                <SelectItem value="ca-law">California State</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="caseReferenceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Case Reference ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. CASE-2024-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Document Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="contract">Contract / Agreement</SelectItem>
                                                <SelectItem value="case-law">Case Law</SelectItem>
                                                <SelectItem value="statute">Statute / Regulation</SelectItem>
                                                <SelectItem value="pleading">Pleading</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isUploading ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Uploading & Indexing...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} />
                                </div>
                            ) : (
                                <Button type="submit" className="w-full" disabled={!file}>
                                    {file ? "Upload & Index" : "Select File to Continue"}
                                </Button>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
