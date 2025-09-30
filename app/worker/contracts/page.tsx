import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, CheckCircle, Clock, XCircle } from "lucide-react"
import { mockContracts } from "@/lib/mock-data"

export default function WorkerContractsPage() {
  const activeContracts = mockContracts.filter((c) => c.status === "active")
  const pendingContracts = mockContracts.filter((c) => c.status === "pending")
  const completedContracts = mockContracts.filter((c) => c.status === "completed")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      case "completed":
        return "bg-blue-500/10 text-blue-700 border-blue-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const ContractCard = ({ contract }: { contract: (typeof mockContracts)[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{contract.employerName}</CardTitle>
            <CardDescription>{contract.position}</CardDescription>
          </div>
          <Badge className={getStatusColor(contract.status)} variant="outline">
            <span className="flex items-center gap-1">
              {getStatusIcon(contract.status)}
              {contract.status}
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">{contract.startDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="font-medium">{contract.endDate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Salary</p>
            <p className="font-medium text-secondary">{contract.salary}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Location</p>
            <p className="font-medium">{contract.location}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <PortalLayout userType="worker">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Contracts</h1>
          <p className="text-muted-foreground mt-2">View and manage your employment contracts</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active ({activeContracts.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingContracts.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedContracts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}
