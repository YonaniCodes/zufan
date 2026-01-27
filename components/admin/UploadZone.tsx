"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Upload, X, File as FileIcon, CheckCircle2, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

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
import { api } from "@/lib/api"

const formSchema = z.object({
    jurisdiction: z.string().min(1, "Please select a jurisdiction"),
    caseReferenceId: z.string().min(1, "Case reference ID is required"),
    documentType: z.string().min(1, "Please select a document type"),
})

interface UploadZoneProps {
    onUploadSuccess?: () => void
}

export function UploadZone({ onUploadSuccess }: UploadZoneProps) {
    const [file, setFile] = React.useState<File | null>(null)
    const [progress, setProgress] = React.useState(0)
    const [isUploading, setIsUploading] = React.useState(false)
    const [uploadType, setUploadType] = React.useState<'pdf' | 'chunks'>('pdf')
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
            const selectedFile = e.target.files[0]
            // Validate file type based on upload mode
            if (uploadType === 'pdf' && selectedFile.type !== 'application/pdf') {
                toast.error('Please select a PDF file')
                return
            }
            if (uploadType === 'chunks' && selectedFile.type !== 'application/json') {
                toast.error('Please select a JSON file for chunks upload')
                return
            }
            setFile(selectedFile)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!file) {
            toast.error("No file selected", {
                description: "Please select a file to upload.",
            })
            return
        }

        setIsUploading(true)
        setProgress(10)

        try {
            // Simulated progress because standard fetch doesn't support progress events easily
            const interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 5 : prev))
            }, 300)

            if (uploadType === 'pdf') {
                // Backend only accepts the file, metadata is frontend-only for now
                await api.uploadFile(file)
            } else {
                // For chunks, read the JSON file and send it
                const text = await file.text()
                const chunks = JSON.parse(text)
                await api.uploadChunks(chunks)
            }

            clearInterval(interval)
            setProgress(100)

            toast.success("Upload Successful", {
                description: `${uploadType === 'pdf' ? 'Document' : 'Chunks'} ${file.name} indexed successfully.`,
            })

            setFile(null)
            form.reset()

            // Wait a moment for backend to finish processing before refreshing
            setTimeout(() => {
                onUploadSuccess?.()
            }, 500)
        } catch (error) {
            toast.error("Upload Failed", {
                description: "An error occurred during indexing. Please try again.",
            })
            console.error("Upload error:", error)
        } finally {
            setIsUploading(false)
            setProgress(0)
        }
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
                    {/* Upload Type Toggle */}
                    <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-muted/30 w-full max-w-sm">
                        <FileText className={`h-4 w-4 ${uploadType === 'pdf' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Label htmlFor="upload-mode" className="text-sm font-medium flex-1">
                            {uploadType === 'pdf' ? 'PDF Upload' : 'Chunks Upload'}
                        </Label>
                        <Switch
                            id="upload-mode"
                            checked={uploadType === 'chunks'}
                            onCheckedChange={(checked) => {
                                setUploadType(checked ? 'chunks' : 'pdf')
                                setFile(null) // Clear file when switching modes
                            }}
                        />
                    </div>

                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={uploadType === 'pdf' ? '.pdf' : '.json'}
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
                            <h3 className="font-semibold text-lg">
                                {uploadType === 'pdf' ? 'Upload Legal Document' : 'Upload Chunks JSON'}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {uploadType === 'pdf' ? 'PDF files (Max 50MB)' : 'JSON files with pre-chunked data'}
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
                                                <SelectItem value="et-federal">Ethiopian Federal</SelectItem>
                                                <SelectItem value="et-addis-ababa">Addis Ababa City Courts</SelectItem>
                                                <SelectItem value="et-oromia">Oromia Regional Courts</SelectItem>
                                                <SelectItem value="et-amhara">Amhara Regional Courts</SelectItem>
                                                <SelectItem value="et-tigray">Tigray Regional Courts</SelectItem>
                                                <SelectItem value="et-sidama">Sidama Regional Courts</SelectItem>
                                                <SelectItem value="et-somali">Somali Regional Courts</SelectItem>
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
                                                <SelectItem value="proclamation">Proclamation</SelectItem>
                                                <SelectItem value="directive">Directive</SelectItem>
                                                <SelectItem value="regulation">Regulation</SelectItem>
                                                <SelectItem value="court-decision">Court Decision</SelectItem>
                                                <SelectItem value="contract">Contract / Agreement</SelectItem>
                                                <SelectItem value="cassation">Cassation Decision</SelectItem>
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
