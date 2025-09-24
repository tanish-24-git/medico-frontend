"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Bot, FileText, MessageSquare, Stethoscope, Upload, Zap, Shield, Clock, Users } from "lucide-react"
import Link from "next/link"

export function HomeHero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-blue/5 to-medical-purple/5">
      {/* Header */}
      <header className="border-b border-medical-blue/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-purple rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SHIVAAI</h1>
              <p className="text-sm text-muted-foreground">Medical AI Assistant</p>
            </div>
          </div>
          <Link href="/chat">
            <Button className="bg-medical-blue hover:bg-medical-blue/90">
              Start Chat <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-6 bg-medical-blue/10 text-medical-blue border-medical-blue/20">
          Powered by Advanced AI & RAG Technology
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-medical-blue via-medical-purple to-medical-green bg-clip-text text-transparent">
          Your Intelligent Medical Assistant
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto">
          SHIVAAI combines cutting-edge AI with medical expertise to provide instant answers, analyze reports, and
          simplify complex medical terminology for better healthcare understanding.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/chat">
            <Button size="lg" className="bg-medical-blue hover:bg-medical-blue/90 text-white">
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Medical Chat
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-medical-blue/20 hover:bg-medical-blue/5 bg-transparent">
            <FileText className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Medical AI Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four powerful tools designed to enhance your medical knowledge and healthcare experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-medical-blue/20 hover:border-medical-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-medical-blue/10">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-medical-blue" />
              </div>
              <CardTitle className="text-medical-blue">AI Medical Chat</CardTitle>
              <CardDescription>
                Get instant answers to medical questions using advanced RAG technology and comprehensive medical
                databases.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Evidence-based responses</li>
                <li>• Disease information lookup</li>
                <li>• Symptom analysis</li>
                <li>• Treatment guidance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-medical-purple/20 hover:border-medical-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-medical-purple/10">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-purple/10 rounded-lg flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-medical-purple" />
              </div>
              <CardTitle className="text-medical-purple">Report Analysis</CardTitle>
              <CardDescription>
                Upload medical reports, lab results, or images for AI-powered analysis and interpretation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• PDF & image support</li>
                <li>• Lab result interpretation</li>
                <li>• Medical imaging analysis</li>
                <li>• Detailed explanations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-medical-green/20 hover:border-medical-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-medical-green/10">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-green/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-medical-green" />
              </div>
              <CardTitle className="text-medical-green">Term Simplifier</CardTitle>
              <CardDescription>
                Convert complex medical terminology into easy-to-understand language for better comprehension.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Plain language explanations</li>
                <li>• Medical jargon breakdown</li>
                <li>• Context-aware definitions</li>
                <li>• Educational insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-medical-accent/20 hover:border-medical-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-medical-accent/10">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-medical-accent" />
              </div>
              <CardTitle className="text-medical-accent">Real-Time Chat</CardTitle>
              <CardDescription>
                Experience instant medical consultations with WebSocket-powered real-time communication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Instant responses</li>
                <li>• Live disease queries</li>
                <li>• WebSocket technology</li>
                <li>• Seamless interaction</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-medical-blue/5 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose SHIVAAI?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Built with healthcare professionals and patients in mind
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-medical-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Trusted & Secure</h3>
            <p className="text-muted-foreground">
              Built with medical-grade security standards and evidence-based medical knowledge for reliable healthcare
              information.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-medical-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-medical-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-3">24/7 Availability</h3>
            <p className="text-muted-foreground">
              Access medical information and assistance anytime, anywhere with our always-available AI assistant.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-medical-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-medical-green" />
            </div>
            <h3 className="text-xl font-semibold mb-3">User-Friendly</h3>
            <p className="text-muted-foreground">
              Designed for both healthcare professionals and patients with intuitive interfaces and clear explanations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Intelligent Healthcare?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users who trust SHIVAAI for their medical information needs. Start your conversation with
            our AI medical assistant today.
          </p>
          <Link href="/chat">
            <Button
              size="lg"
              className="bg-gradient-to-r from-medical-blue to-medical-purple hover:from-medical-blue/90 hover:to-medical-purple/90 text-white"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Your Medical Chat Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-medical-blue/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-medical-blue to-medical-purple rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">SHIVAAI Medical AI</p>
                <p className="text-sm text-muted-foreground">Intelligent Healthcare Assistant</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SHIVAAI. Built with FastAPI & Next.js for better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
