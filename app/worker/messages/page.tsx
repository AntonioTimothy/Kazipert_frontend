import { PortalLayout } from "@/components/portal-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search } from "lucide-react"

export default function WorkerMessagesPage() {
  const conversations = [
    {
      id: 1,  
      name: "Al-Rashid Family",
      avatar: "/middle-eastern-professional.png",
      lastMessage: "Thank you for your hard work today!",
      time: "2 hours ago",
      unread: 2,
    },
    {
      id: 2,
      name: "Kazipert Support",
      avatar: "",
      lastMessage: "Your KYC verification has been approved",
      time: "1 day ago",
      unread: 0,
    },
    {
      id: 3,
      name: "Al-Mansouri Residence",
      avatar: "/middle-eastern-businessman.jpg",
      lastMessage: "We would like to schedule an interview",
      time: "3 days ago",
      unread: 1,
    },
  ]

  const currentMessages = [
    {
      id: 1,
      sender: "employer",
      text: "Hello! How are you settling in?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "worker",
      text: "Very well, thank you! Everyone has been very welcoming.",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "employer",
      text: "That's wonderful to hear. Please let me know if you need anything.",
      time: "10:40 AM",
    },
    {
      id: 4,
      sender: "employer",
      text: "Thank you for your hard work today!",
      time: "2 hours ago",
    },
  ]

  return (
    <PortalLayout userType="worker">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Messages</h1>
          <p className="text-muted-foreground mt-2">Communicate with employers and support</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <Avatar>
                    <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{conv.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{conv.name}</p>
                      {conv.unread > 0 && <Badge className="bg-accent-coral text-white">{conv.unread}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground mt-1">{conv.time}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/middle-eastern-professional.png" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Al-Rashid Family</CardTitle>
                  <CardDescription>Active now</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "worker" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === "worker" ? "bg-primary text-primary-foreground" : "bg-background border"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === "worker" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input placeholder="Type your message..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}
