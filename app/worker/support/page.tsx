"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"
import {
  Home,
  Briefcase,
  FileText,
  CreditCard,
  Shield,
  Video,
  MessageSquare,
  Star,
  Headphones,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Download,
  User,
  Calendar,
  MessageCircle,
  PhoneCall,
  MapPin,
  ShieldCheck,
  Heart,
  Ambulance,
  FireExtinguisher,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/ThemeContext"
import { cn } from "@/lib/utils"
import type { WorkerProfile } from "@/lib/mock-data"

// Mock data for tickets and emergency contacts
const supportData = {
  tickets: [
    {
      id: "TKT001",
      subject: "Payment Delay for January Salary",
      description: "My salary for January work has not been processed yet. It's been 5 days past the expected payment date.",
      category: "Payment",
      priority: "urgent",
      status: "open",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-21",
      responses: [
        {
          id: "RES001",
          message: "We've escalated this to our finance team. They're investigating the delay.",
          sender: "Support Agent",
          timestamp: "2024-01-20 14:30",
          isAgent: true
        }
      ]
    },
    {
      id: "TKT002",
      subject: "Contract Document Clarification",
      description: "Need clarification on clause 4.2 regarding working hours and overtime compensation.",
      category: "Contract",
      priority: "normal",
      status: "in-progress",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-19",
      responses: [
        {
          id: "RES002",
          message: "Our legal team is reviewing your contract and will provide clarification within 24 hours.",
          sender: "Legal Support",
          timestamp: "2024-01-18 11:15",
          isAgent: true
        }
      ]
    },
    {
      id: "TKT003",
      subject: "Training Certificate Not Received",
      description: "Completed the Arabic Language course 3 days ago but haven't received my certificate.",
      category: "Training",
      priority: "normal",
      status: "resolved",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-16",
      responses: [
        {
          id: "RES003",
          message: "Certificate has been issued and sent to your email. Please check your spam folder as well.",
          sender: "Training Support",
          timestamp: "2024-01-16 09:45",
          isAgent: true
        }
      ]
    }
  ],
  emergencyContacts: [
    {
      id: "EMG001",
      name: "Police Emergency",
      number: "9999",
      description: "For immediate police assistance and security emergencies",
      icon: Ambulance,
      type: "security"
    },
    {
      id: "EMG002",
      name: "Ambulance & Medical",
      number: "9999",
      description: "Medical emergencies and ambulance services",
      icon: Ambulance,
      type: "medical"
    },
    {
      id: "EMG003",
      name: "Fire Department",
      number: "9999",
      description: "Fire emergencies and rescue services",
      icon: FireExtinguisher,
      type: "fire"
    },
    {
      id: "EMG004",
      name: "Kazipert 24/7 Emergency",
      number: "+254 711 000000",
      description: "24/7 emergency support for workers abroad",
      icon: ShieldCheck,
      type: "support"
    },
    {
      id: "EMG005",
      name: "Legal Emergency Hotline",
      number: "+254 722 000000",
      description: "Immediate legal assistance and advice",
      icon: Heart,
      type: "legal"
    },
    {
      id: "EMG006",
      name: "Mental Health Support",
      number: "+254 733 000000",
      description: "Confidential mental health and counseling services",
      icon: Heart,
      type: "health"
    }
  ]
}

export default function WorkerSupportPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("new-ticket")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("normal")
  const [selectedCategory, setSelectedCategory] = useState("general")

  // New ticket form state
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const userData = sessionStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "worker") {
      router.push("/login")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const navigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: Home },
    { name: "Find Jobs", href: "/worker/jobs", icon: Briefcase },
    { name: "My Applications", href: "/worker/contracts", icon: FileText },
    { name: "Wallet", href: "/worker/payments", icon: CreditCard },
    { name: "Services", href: "/worker/services", icon: Shield },
    { name: "Training", href: "/worker/training", icon: Video },
    { name: "Reviews", href: "/worker/reviews", icon: Star },
    { name: "Support", href: "/worker/support", icon: MessageSquare },
  ]

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "payment", label: "Payment Issue" },
    { value: "contract", label: "Contract Related" },
    { value: "technical", label: "Technical Support" },
    { value: "training", label: "Training & Certificates" },
    { value: "legal", label: "Legal Assistance" },
    { value: "emergency", label: "Emergency Situation" },
    { value: "other", label: "Other" }
  ]

  const priorities = [
    { value: "low", label: "Low Priority", description: "General questions and non-urgent matters", color: "text-green-600 bg-green-500/10" },
    { value: "normal", label: "Normal", description: "Standard support requests", color: "text-blue-600 bg-blue-500/10" },
    { value: "high", label: "High Priority", description: "Important issues needing attention", color: "text-orange-600 bg-orange-500/10" },
    { value: "urgent", label: "Super Urgent", description: "Critical issues requiring immediate action", color: "text-red-600 bg-red-500/10" }
  ]

  const filteredTickets = supportData.tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketDescription) {
      toast.error("Please fill in all fields", {
        description: "Subject and description are required to create a support ticket."
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success("Ticket Created Successfully!", {
        description: `Your ${selectedPriority} priority ticket has been submitted. We'll respond within 2 hours.`,
        duration: 5000,
      })
      
      // Reset form
      setTicketSubject("")
      setTicketDescription("")
      setSelectedPriority("normal")
      setSelectedCategory("general")
      setIsSubmitting(false)
      setActiveTab("my-tickets")
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "closed":
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <MoreHorizontal className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "in-progress":
        return "text-amber-600 bg-amber-500/10 border-amber-500/20"
      case "resolved":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "closed":
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-green-600 bg-green-500/10 border-green-500/20"
      case "normal":
        return "text-blue-600 bg-blue-500/10 border-blue-500/20"
      case "high":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20"
      case "urgent":
        return "text-red-600 bg-red-500/10 border-red-500/20"
      default:
        return "text-gray-600 bg-gray-500/10 border-gray-500/20"
    }
  }

  const handleEmergencyCall = (contact: any) => {
    toast.warning("Emergency Contact", {
      description: `Calling ${contact.name} at ${contact.number}. Please use only for genuine emergencies.`,
      duration: 6000,
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <PortalLayout navigation={navigation} user={user}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Headphones className="h-8 w-8 text-primary" />
              Support Center
            </h1>
            <p className="text-xl text-muted-foreground">
              We're here to help you 24/7. Choose the right support option for your needs.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary"
              className="px-3 py-1"
              style={{
                backgroundColor: currentTheme.colors.primary + '15'
              }}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              24/7 Available
            </Badge>
          </div>
        </div>

        {/* Emergency Banner */}
        <Card 
          className="border-2 border-red-200 bg-red-50/50 backdrop-blur-sm"
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Emergency Assistance</h3>
              <p className="text-sm text-red-700 mt-1">
                For immediate help in critical situations, use the emergency contacts below. Available 24/7.
              </p>
            </div>
            <Button 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => setActiveTab("emergency")}
            >
              <PhoneCall className="h-4 w-4 mr-2" />
              Emergency Contacts
            </Button>
          </CardContent>
        </Card>

        {/* Support Options Tabs */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid w-full grid-cols-4 p-1 rounded-xl"
                style={{
                  backgroundColor: currentTheme.colors.backgroundLight
                }}
              >
                <TabsTrigger 
                  value="new-ticket"
                  className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === 'new-ticket' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'new-ticket' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </TabsTrigger>
                <TabsTrigger 
                  value="my-tickets"
                  className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === 'my-tickets' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'my-tickets' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  My Tickets
                </TabsTrigger>
                <TabsTrigger 
                  value="emergency"
                  className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === 'emergency' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'emergency' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Emergency
                </TabsTrigger>
                <TabsTrigger 
                  value="contact"
                  className="rounded-lg data-[state=active]:shadow-sm transition-all duration-300"
                  style={{
                    backgroundColor: activeTab === 'contact' ? currentTheme.colors.primary : 'transparent',
                    color: activeTab === 'contact' ? currentTheme.colors.text : currentTheme.colors.text
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </TabsTrigger>
              </TabsList>

              {/* New Ticket Tab */}
              <TabsContent value="new-ticket" className="space-y-6 p-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold">Create Support Ticket</h2>
                  <p className="text-muted-foreground">
                    Describe your issue in detail. Our support team will respond based on your selected priority level.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Ticket Form */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-primary" />
                        Ticket Details
                      </CardTitle>
                      <CardDescription>Provide detailed information about your issue</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="border-2 border-border/50 focus:border-primary/50">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Priority Level</label>
                        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                          <SelectTrigger className="border-2 border-border/50 focus:border-primary/50">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((priority) => (
                              <SelectItem key={priority.value} value={priority.value}>
                                <div className="flex items-center gap-2">
                                  <div className={cn("w-2 h-2 rounded-full", {
                                    "bg-green-500": priority.value === "low",
                                    "bg-blue-500": priority.value === "normal",
                                    "bg-orange-500": priority.value === "high",
                                    "bg-red-500": priority.value === "urgent"
                                  })} />
                                  {priority.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedPriority && (
                          <p className="text-xs text-muted-foreground">
                            {priorities.find(p => p.value === selectedPriority)?.description}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input
                          placeholder="Brief description of your issue"
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          className="border-2 border-border/50 focus:border-primary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Please provide detailed information about your issue, including any relevant dates, amounts, or specific problems..."
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          rows={6}
                          className="border-2 border-border/50 focus:border-primary/50 resize-none"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full transition-all duration-300 hover:scale-105"
                        onClick={handleSubmitTicket}
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: currentTheme.colors.text
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                            Creating Ticket...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Support Ticket
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Priority Information */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Response Times
                      </CardTitle>
                      <CardDescription>Expected response times based on priority</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {priorities.map((priority) => (
                        <div 
                          key={priority.value}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all duration-300",
                            selectedPriority === priority.value && "scale-105 shadow-md",
                            priority.value === "low" && "border-green-200 bg-green-50/50",
                            priority.value === "normal" && "border-blue-200 bg-blue-50/50",
                            priority.value === "high" && "border-orange-200 bg-orange-50/50",
                            priority.value === "urgent" && "border-red-200 bg-red-50/50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{priority.label}</span>
                            <Badge className={priority.color}>
                              {priority.value === "low" && "Within 24 hours"}
                              {priority.value === "normal" && "Within 12 hours"}
                              {priority.value === "high" && "Within 6 hours"}
                              {priority.value === "urgent" && "Within 2 hours"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{priority.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* My Tickets Tab */}
              <TabsContent value="my-tickets" className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">My Support Tickets</h2>
                    <p className="text-muted-foreground">Track the status of your support requests</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 border-2 border-border/50 focus:border-primary/50 w-64"
                      />
                    </div>
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <Card 
                      key={ticket.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                              <Badge className={getPriorityColor(ticket.priority)}>
                                {ticket.priority === 'urgent' && <Zap className="h-3 w-3 mr-1" />}
                                {ticket.priority}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                {getStatusIcon(ticket.status)}
                                <span className="ml-1 capitalize">{ticket.status}</span>
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{ticket.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Updated: {new Date(ticket.updatedAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {ticket.responses.length} responses
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10">
                            View Details
                          </Button>
                        </div>

                        {/* Latest Response */}
                        {ticket.responses.length > 0 && (
                          <div className="border-t border-border/30 pt-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{ticket.responses[0].sender}</span>
                                  <span className="text-xs text-muted-foreground">{ticket.responses[0].timestamp}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{ticket.responses[0].message}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {filteredTickets.length === 0 && (
                    <Card className="border-0 shadow-lg text-center">
                      <CardContent className="py-12">
                        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                        <p className="text-muted-foreground mb-6">
                          {searchQuery ? "Try adjusting your search criteria" : "You haven't created any support tickets yet"}
                        </p>
                        <Button 
                          onClick={() => setActiveTab("new-ticket")}
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.text
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Ticket
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Emergency Contacts Tab */}
              <TabsContent value="emergency" className="space-y-6 p-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold">Emergency Contacts</h2>
                  <p className="text-muted-foreground">
                    Immediate assistance for critical situations. Save these numbers for emergencies.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {supportData.emergencyContacts.map((contact) => {
                    const IconComponent = contact.icon
                    return (
                      <Card 
                        key={contact.id}
                        className="border-2 border-red-100 bg-red-50/30 hover:border-red-200 transition-all duration-300 hover:scale-105"
                      >
                        <CardContent className="p-6 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mx-auto mb-4">
                            <IconComponent className="h-8 w-8 text-red-500" />
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{contact.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{contact.description}</p>
                          
                          <div className="space-y-3">
                            <div className="text-2xl font-bold text-red-600">{contact.number}</div>
                            <Button 
                              className="w-full bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleEmergencyCall(contact)}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Emergency Instructions */}
                <Card className="border-2 border-amber-200 bg-amber-50/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Instructions
                    </CardTitle>
                    <CardDescription className="text-amber-700">
                      Important guidelines for emergency situations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-amber-800">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                        Stay calm and provide clear information about your location and situation
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                        Follow instructions from emergency services personnel
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                        Contact Kazipert support immediately after ensuring your safety
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
                        Keep your identification and important documents accessible
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-6 p-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <h2 className="text-2xl font-bold">Other Contact Methods</h2>
                  <p className="text-muted-foreground">
                    Multiple ways to reach our support team for non-emergency matters
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      icon: MessageCircle,
                      title: "Live Chat",
                      description: "Instant messaging with our support agents",
                      availability: "24/7",
                      action: "Start Chat",
                      color: "text-blue-500"
                    },
                    {
                      icon: Mail,
                      title: "Email Support",
                      description: "Detailed assistance via email",
                      availability: "Response within 6 hours",
                      action: "Send Email",
                      color: "text-green-500"
                    },
                    {
                      icon: Phone,
                      title: "Phone Support",
                      description: "Speak directly with our team",
                      availability: "8:00 AM - 8:00 PM",
                      action: "Call Now",
                      color: "text-purple-500"
                    },
                    {
                      icon: MapPin,
                      title: "Office Visit",
                      description: "Visit our support center",
                      availability: "By appointment",
                      action: "Get Directions",
                      color: "text-orange-500"
                    }
                  ].map((method, index) => {
                    const IconComponent = method.icon
                    return (
                      <Card 
                        key={index}
                        className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.colors.backgroundLight} 0%, ${currentTheme.colors.background} 100%)`
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                            <IconComponent className="h-8 w-8" style={{ color: currentTheme.colors.primary }} />
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                          
                          <div className="space-y-3">
                            <Badge 
                              variant="secondary"
                              style={{
                                backgroundColor: currentTheme.colors.primary + '15'
                              }}
                            >
                              {method.availability}
                            </Badge>
                            <Button 
                              variant="outline"
                              className="w-full border-primary/30 hover:bg-primary/10"
                            >
                              {method.action}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}