"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
    agent: "my-agent",
    tokenUrl: "/api/an-token",
})

export default function Page() {
    const { messages, sendMessage, status, stop, error } = useChat({ chat })

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Agent Chat</h1>
            <div className="flex-1 overflow-hidden border rounded-lg bg-white shadow-sm">
                <AgentChat
                    messages={messages}
                    onSend={(msg: any) => sendMessage({ parts: [{ type: "text", text: msg.content }] })}
                    status={status}
                    onStop={stop}
                    error={error ?? undefined}
                />
            </div>
        </div>
    )
}
