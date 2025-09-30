import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, Calendar, CreditCard } from "lucide-react"

export default function EmployerPaymentsPage() {
  const upcomingPayments = [
    { id: 1, worker: "Amina Hassan", amount: "OMR 450", dueDate: "2025-02-15", status: "scheduled" },
    { id: 2, worker: "Fatima Ochieng", amount: "OMR 420", dueDate: "2025-02-15", status: "scheduled" },
  ]

  const paymentHistory = [
    { id: 1, worker: "Amina Hassan", amount: "OMR 450", date: "2025-01-15", status: "completed" },
    { id: 2, worker: "Amina Hassan", amount: "OMR 450", date: "2024-12-15", status: "completed" },
    { id: 3, worker: "Amina Hassan", amount: "OMR 450", date: "2024-11-15", status: "completed" },
  ]

  return (
    <PortalLayout userType="employer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Payments & Payroll</h1>
          <p className="text-muted-foreground mt-2">Manage salary payments to your workers</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">OMR 5,400</div>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Currently employed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OMR 450</div>
              <p className="text-xs text-muted-foreground">Due Feb 15, 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">•••• 4532</div>
              <p className="text-xs text-muted-foreground">Visa ending in 4532</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Scheduled salary payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{payment.worker}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-secondary">{payment.amount}</p>
                    <Button size="sm">Pay Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Past salary payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{payment.worker}</p>
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
