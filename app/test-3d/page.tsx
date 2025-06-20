'use client';

import { Logo3D } from '@/src/components/3d/Logo3D';
import { AnimatedText } from '@/src/components/animations/AnimatedText';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Test3DPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Test AnimatedText */}
        <Card className="p-6">
          <AnimatedText 
            text="Bienvenue sur le Portail de Recrutement IA" 
            className="text-3xl font-bold mb-4"
            animation="slideUp"
          />
          <AnimatedText 
            text="Découvrez nos opportunités de carrière avec une expérience immersive"
            className="text-lg text-muted-foreground"
            animation="fadeIn"
          />
        </Card>

        {/* Test Logo 3D */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Logo 3D Interactif</h2>
          <div className="flex justify-center">
            <Logo3D />
          </div>
          <p className="text-center mt-4 text-muted-foreground">
            Utilisez votre souris pour faire tourner le logo
          </p>
        </Card>

        {/* Test Boutons avec animations */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Composants UI</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="default">Bouton Primary</Button>
            <Button variant="secondary">Bouton Secondary</Button>
            <Button variant="outline">Bouton Outline</Button>
            <Button variant="destructive">Bouton Destructive</Button>
          </div>
        </Card>

        {/* Info Stack */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Technologies Installées</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">Three.js</h3>
              <p className="text-sm text-muted-foreground">✅ Installé</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">GSAP</h3>
              <p className="text-sm text-muted-foreground">✅ Installé</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">React Query</h3>
              <p className="text-sm text-muted-foreground">✅ Installé</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">Zustand</h3>
              <p className="text-sm text-muted-foreground">✅ Installé</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">Framer Motion</h3>
              <p className="text-sm text-muted-foreground">⚠️ À installer</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <h3 className="font-semibold">shadcn/ui</h3>
              <p className="text-sm text-muted-foreground">✅ Configuré</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}