import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from 'react';

const DesignSystem: React.FC = () => {
    return (
        <div className="container mx-auto py-10 space-y-12">
            <section className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Leftorium Design System</h1>
                <p className="text-xl text-muted-foreground">A pastel-themed design system optimized for both light and dark modes.</p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-primary text-primary-foreground border">
                        <span className="font-bold">Primary</span>
                        <p className="text-xs opacity-80">Pastel Blue-Lavender</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary text-secondary-foreground border">
                        <span className="font-bold">Secondary</span>
                        <p className="text-xs opacity-80">Pastel Mint</p>
                    </div>
                    <div className="p-4 rounded-lg bg-accent text-accent-foreground border">
                        <span className="font-bold">Accent</span>
                        <p className="text-xs opacity-80">Pastel Pink/Peach</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted text-muted-foreground border text-center">
                        <span className="font-bold">Muted</span>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="default">Default Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="outline">Outline Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="destructive">Destructive Button</Button>
                    <Button variant="link">Link Button</Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Badges</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge>Default Badge</Badge>
                    <Badge variant="secondary">Secondary Badge</Badge>
                    <Badge variant="outline">Outline Badge</Badge>
                    <Badge variant="destructive">Destructive Badge</Badge>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Example Card</CardTitle>
                            <CardDescription>A simple card with title and description.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>This is the content area of the card. It looks great in pastel.</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Deploy</Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-accent/10 border-accent/20">
                        <CardHeader>
                            <CardTitle>Accent Card</CardTitle>
                            <CardDescription>Using the pastel accent color as a background.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>The accent color adds a nice pop while remaining soft.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold border-b pb-2">Inputs & Textarea</h2>
                <div className="max-w-md space-y-4">
                    <Input placeholder="Enter some text..." />
                    <Textarea placeholder="Enter a longer description..." />
                </div>
            </section>
        </div>
    );
};

export default DesignSystem;
