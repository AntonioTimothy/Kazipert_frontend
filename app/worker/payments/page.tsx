import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Wallet, Send, ArrowDownToLine } from "lucide-react"

export default function WorkerPaymentsPage() {
  const payments = [
    { id: 1, date: "2025-01-15", amount: "OMR 450", status: "completed", employer: "Al-Rashid Family" },
    { id: 2, date: "2024-12-15", amount: "OMR 450", status: "completed", employer: "Al-Rashid Family" },
    { id: 3, date: "2024-11-15", amount: "OMR 450", status: "completed", employer: "Al-Rashid Family" },
    { id: 4, date: "2024-10-15", amount: "OMR 450", status: "completed", employer: "Al-Rashid Family" },
  ]

  return (
    <PortalLayout userType="worker">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-balance">Payments & Salary</h1>
          <p className="text-muted-foreground mt-2">Track your earnings and manage money transfers</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">OMR 5,400</div>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">OMR 1,200</div>
              <p className="text-xs text-muted-foreground">Available to transfer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OMR 450</div>
              <p className="text-xs text-muted-foreground">Due Feb 15, 2025</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & M-Pesa Integration */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your money</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Send Money to Kenya (M-Pesa)
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Request Salary Advance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>M-Pesa Integration</CardTitle>
              <CardDescription>Connected account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">+254 712 345 678</p>
                  <p className="text-sm text-muted-foreground">Verified M-Pesa account</p>
                </div>
                <Badge className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Change Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your salary payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{payment.employer}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-secondary">{payment.amount}</p>
                    <Badge className="bg-green-500/10 text-green-700 border-green-200" variant="outline">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}
