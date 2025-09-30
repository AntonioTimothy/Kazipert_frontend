import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, Plus } from "lucide-react"
import { mockContracts } from "@/lib/mock-data"

export default function EmployerContractsPage() {
  const activeContracts = mockContracts.filter((c) => c.status === "active")
  const pendingContracts = mockContracts.filter((c) => c.status === "pending")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200"
    }
  }

  const ContractCard = ({ contract }: { contract: (typeof mockContracts)[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{contract.workerName}</CardTitle>
            <CardDescription>{contract.position}</CardDescription>
          </div>
          <Badge className={getStatusColor(contract.status)} variant="outline">
            {contract.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Contract Period</p>
            <p className="font-medium">
              {contract.startDate} - {contract.endDate}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Salary</p>
            <p className="font-medium text-secondary">{contract.salary}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            View Contract
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <PortalLayout userType="employer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Employment Contracts</h1>
            <p className="text-muted-foreground mt-2">Manage contracts with your workers</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Contracts ({activeContracts.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval ({pendingContracts.length})</TabsTrigger>
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
        </Tabs>
      </div>
    </PortalLayout>
  )
}
