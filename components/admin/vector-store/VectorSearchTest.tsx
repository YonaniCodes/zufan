"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function VectorSearchTest() {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<any[]>([])
    const [isSearching, setIsSearching] = React.useState(false)

    const handleSearch = () => {
        if (!query) return
        setIsSearching(true)

        // Simulate search delay
        setTimeout(() => {
            setResults([
                {
                    id: "chk_9283",
                    text: "...the obligations of the Confidentiality Agreement shall survive the termination of this contract for a period of five (5) years...",
                    source: "NDA_Alpha_Corp_v2.pdf",
                    score: 0.89,
                },
                {
                    id: "chk_1029",
                    text: "...neither party may disclose the terms of this settlement without prior written consent...",
                    source: "Smith_v_Jones_Ruling.docx",
                    score: 0.76,
                },
                {
                    id: "chk_5512",
                    text: "...data processing agreements must be in place before transferring personal data to third countries...",
                    source: "Regulation_EU_2024_AI.pdf",
                    score: 0.72,
                }
            ])
            setIsSearching(false)
        }, 800)
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Semantic Search Playground</CardTitle>
                <CardDescription>
                    Test retrieval relevance by simulating user queries.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex w-full max-w-sm items-center space-x-2 mb-6">
                    <Input
                        type="text"
                        placeholder="Enter a legal concept..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button type="submit" onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? "..." : <Search className="h-4 w-4" />}
                    </Button>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Results {results.length > 0 && `(${results.length})`}</h4>
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {results.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No results to display. Try a search.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {results.map((result) => (
                                    <div key={result.id} className="flex flex-col gap-2 rounded-lg border p-3 bg-muted/30">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">{result.source}</Badge>
                                            <span className="text-xs font-mono text-green-600">score: {result.score}</span>
                                        </div>
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            "{result.text}"
                                        </p>
                                        <div className="text-xs text-muted-foreground font-mono">ID: {result.id}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}
