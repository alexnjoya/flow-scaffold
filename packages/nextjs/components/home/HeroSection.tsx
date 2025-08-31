"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Bot, ArrowRight, Shield, Users, DollarSign } from "lucide-react";

export function HeroSection() {
  const router = useRouter();

  const agentTypes = [
    {
      name: "Payment Agent",
      description: "Handle payments and financial transactions",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      href: "/onboarding?agent=Payment%20Agent&ens=payment.agent.eth&role=Payment%20Agent"
    },
    {
      name: "Identity Agent",
      description: "Manage credentials and verifications",
      icon: Shield,
      color: "from-blue-500 to-cyan-600",
      href: "/onboarding?agent=Identity%20Agent&ens=identity.agent.eth&role=Identity%20Agent"
    },
    {
      name: "Community Agent",
      description: "Coordinate groups and communities",
      icon: Users,
      color: "from-purple-500 to-indigo-600",
      href: "/onboarding?agent=Community%20Agent&ens=community.agent.eth&role=Community%20Agent"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Intelligent{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI Agents
              </span>
              <br />
              for Everyone
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Create, manage, and coordinate with AI assistants that help you with various tasks. 
              Your agents can handle payments, verify identities, and coordinate communities.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => router.push("/onboarding")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => router.push("/agents")}
            >
              Explore Agents
            </Button>
          </div>

          {/* Agent Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {agentTypes.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => router.push(agent.href)}
                >
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${agent.color} text-white transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="h-8 w-8" />
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{agent.name}</h3>
                    <p className="text-white/90 text-sm">{agent.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10+</div>
              <div className="text-muted-foreground">Agent Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
