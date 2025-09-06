"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Bot, ArrowRight, Shield, Users, DollarSign } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  const agentTypes = [
    {
      name: "Payment Agent",
      description: "Handle payments, routing, and financial transactions with smart automation",
      icon: DollarSign,
      href: "/onboarding?agent=Kwame&ens=kwame.agent.eth&role=Payment%20Agent"
    },
    {
      name: "ENS Agent", 
      description: "Manage ENS domains, registration, and blockchain name resolution",
      icon: Shield,
      href: "/onboarding?agent=Ama&ens=ama.agent.eth&role=Identity%20Agent"
    },
    {
      name: "Community Agent",
      description: "Coordinate groups, DAOs, and community activities seamlessly",
      icon: Users,
      href: "/onboarding?agent=Kofi&ens=kofi.agent.eth&role=Community%20Agent"
    }
  ];

  return (
    <section className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-8 text-black">
              Intelligent AI Agents
              <br />
              for Everyone
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Deploy autonomous agents that work 24/7. Handle payments, verify identities,
              and coordinate communities with AI that never sleeps.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="text-lg px-8 py-3 bg-black text-white hover:bg-gray-800"
              onClick={() => router.push("/onboarding")}
            >
              <Bot className="mr-2 h-5 w-5" />
              Deploy Your Agent
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-2 border-gray-300 text-black hover:bg-gray-50"
              onClick={() => router.push("/agents")}
            >
              Explore Marketplace
            </Button>
          </div>

          {/* Agent Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {agentTypes.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={index}
                  className="cursor-pointer group"
                  onClick={() => router.push(agent.href)}
                >
                  <div className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-gray-100">
                        <Icon className="h-6 w-6 text-black" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">
                        {agent.name}
                      </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {agent.description}
                      </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
