import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FileText, Search, Settings, ShieldAlert, Upload, UserPlus } from "lucide-react"

export function RecentActivity() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                    Latest actions performed across the system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-primary/10">
                            <Upload className="h-4 w-4 text-primary" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                New Document Uploaded
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Sarah Connor</span> uploaded NDA_Alpha_Corp_v2.pdf
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">1 min ago</div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-green-500/10">
                            <UserPlus className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                New User Registered
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Mike Ross</span> joined the workspace.
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">14 mins ago</div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-orange-500/10">
                            <ShieldAlert className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Failed Login Attempt
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Multiple failed attempts from IP 192.168.1.45
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">45 mins ago</div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-blue-500/10">
                            <Search className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                High Volume Search
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Jessica Pearson</span> executed 50+ queries in 5 mins.
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">2 hours ago</div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-indigo-500/10">
                            <Settings className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                System Configuration Updated
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Retention policy updated to 7 years.
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">5 hours ago</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
