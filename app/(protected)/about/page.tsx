"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Podcast,
  Users,
  Sparkles,
  Calendar,
  Play,
  Settings,
  CreditCard,
  ArrowRight,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import styles from "./page.module.css"
import { useEffect, useState } from "react"
import { getUserCurationProfile } from "@/lib/data"

export default function AboutPage() {
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [isCheckingProfile, setIsCheckingProfile] = useState(true)

  // Check if user already has an active profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      try {
        const profile = await getUserCurationProfile()
        setExistingProfile(profile)
      } catch (error) {
        console.error("Error checking existing profile:", error)
      } finally {
        setIsCheckingProfile(false)
      }
    }

    checkExistingProfile()
  }, [])

  const features = [
    {
      icon: <Podcast className={styles.featureIcon} />,
      title: "AI-Generated Podcasts",
      description: "Our advanced AI creates personalized weekly podcast episodes based on your selected content sources."
    },
    {
      icon: <Users className={styles.featureIcon} />,
      title: "Curated Content",
      description: "Choose from 25 hand-picked podcasts or select from 3 pre-curated bundles designed by our editors."
    },
    {
      icon: <Sparkles className={styles.featureIcon} />,
      title: "Personalized Experience",
      description: "Create custom curation profiles that match your interests and preferences."
    },
    {
      icon: <Calendar className={styles.featureIcon} />,
      title: "Weekly Automation",
      description: "New episodes are automatically generated every Friday, so you never miss fresh content."
    },
    {
      icon: <Play className={styles.featureIcon} />,
      title: "High-Quality Audio",
      description: "Enjoy professionally produced audio episodes with clear narration and seamless transitions."
    },
    {
      icon: <Settings className={styles.featureIcon} />,
      title: "Easy Management",
      description: "Simple interface to manage your curation profiles, view episodes, and control your subscription."
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Start by building a custom curation profile or choose from our pre-curated bundles.",
      action: "Go to Build page"
    },
    {
      step: 2,
      title: "Select Your Content",
      description: "Choose up to 5 individual podcasts or pick one of our 3 curated bundles.",
      action: "Browse curated content"
    },
    {
      step: 3,
      title: "Wait for Generation",
      description: "Our AI processes your selections and generates a personalized episode every Friday.",
      action: "View weekly episodes"
    },
    {
      step: 4,
      title: "Enjoy Your Podcast",
      description: "Listen to your custom episode through our built-in audio player.",
      action: "Start listening"
    }
  ]

  const pricingTiers = [
    {
      name: "Free Trial",
      price: "R0",
      duration: "1 week",
      features: [
        "1 curation profile",
        "Weekly generation",
        "Access to all curated content",
        "Basic support"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "R99",
      duration: "per month",
      features: [
        "Unlimited curation profiles",
        "Weekly generation",
        "Priority support",
        "Advanced analytics",
        "Early access to new features"
      ],
      popular: true
    }
  ]

  // Show loading state while checking for existing profile
  if (isCheckingProfile) {
    return (
      <div className={styles.container}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Welcome to AI Curator
          </h1>
          <p className={styles.heroDescription}>
            Your personal AI-powered podcast curator that creates weekly episodes tailored to your interests.
            Choose from hand-picked content or create your own custom curation profile.
          </p>
          <div className={styles.heroActions}>
            {existingProfile ? (
              <Link href="/dashboard">
                <Button size="lg" className={styles.primaryButton}>
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Button>
              </Link>
            ) : (
              <Link href="/build">
                <Button size="lg" className={styles.primaryButton}>
                  Get Started
                  <ArrowRight size={16} />
                </Button>
              </Link>
            )}
            <Link href="/curated-bundles">
              <Button variant="outline" size="lg">
                Browse Bundles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose AI Curator?</h2>
          <p className={styles.sectionDescription}>
            We combine the best of human curation with AI-powered generation to deliver
            personalized podcast experiences that match your interests.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Card key={index} className={styles.featureCard}>
              <CardHeader>
                <div className={styles.featureIconWrapper}>
                  {feature.icon}
                </div>
                <CardTitle className={styles.featureTitle}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.featureDescription}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionDescription}>
            Getting started with AI Curator is simple. Follow these four easy steps to
            create your personalized podcast experience.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {howItWorks.map((step) => (
            <Card key={step.step} className={styles.stepCard}>
              <CardHeader>
                <div className={styles.stepNumber}>
                  {step.step}
                </div>
                <CardTitle className={styles.stepTitle}>
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={styles.stepDescription}>
                  {step.description}
                </CardDescription>
                <div className={styles.stepAction}>
                  <span className={styles.actionText}>{step.action}</span>
                  <ArrowRight size={14} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Simple Pricing</h2>
          <p className={styles.sectionDescription}>
            Start with a free trial and upgrade when you're ready for unlimited access.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className={`${styles.pricingCard} ${tier.popular ? styles.popularCard : ''}`}>
              {tier.popular && (
                <Badge className={styles.popularBadge}>Most Popular</Badge>
              )}
              <CardHeader>
                <CardTitle className={styles.pricingTitle}>
                  {tier.name}
                </CardTitle>
                <div className={styles.pricingAmount}>
                  <span className={styles.price}>{tier.price}</span>
                  <span className={styles.duration}>/{tier.duration}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className={styles.featuresList}>
                  {tier.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <CheckCircle size={16} className={styles.checkIcon} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/subscription">
                  <Button
                    className={`${styles.pricingButton} ${tier.popular ? styles.popularButton : ''}`}
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.name === "Free Trial" ? "Start Trial" : "Upgrade Now"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <Card className={styles.ctaCard}>
          <CardContent className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Start Your Podcast Journey?
            </h2>
            <p className={styles.ctaDescription}>
              Join thousands of users who are already enjoying personalized AI-generated podcasts.
            </p>
            <div className={styles.ctaActions}>
              {existingProfile ? (
                <Link href="/dashboard">
                  <Button size="lg" className={styles.primaryButton}>
                    Go to Dashboard
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              ) : (
                <Link href="/build">
                  <Button size="lg" className={styles.primaryButton}>
                    Create Your First Profile
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              )}
              <Link href="/curated-bundles">
                <Button variant="outline" size="lg">
                  Explore Bundles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
