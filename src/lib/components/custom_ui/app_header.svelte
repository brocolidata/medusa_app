<script>
    import { base } from "$app/paths";
    import { goto } from "$app/navigation";
    import { toggleMode } from "mode-watcher";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { 
        Sheet, 
        SheetContent, 
        SheetHeader, 
        SheetTitle, 
        SheetTrigger 
    } from "$lib/components/ui/sheet";
    import { Sun, Moon, Menu } from "@lucide/svelte"; 
    import NewBookingDialog from "$custom_ui/new_booking_dialog.svelte";

    let sheetIsOpen = $state(false);
</script>

<header
    class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
    <div
        class="container flex h-14 max-w-screen-2xl items-center justify-between"
    >
        <div class="flex items-center space-x-4 px-4">

            <Sheet bind:open={sheetIsOpen}>
                <SheetTrigger class="{buttonVariants({ variant: "icon" })} md:hidden">
                    <Menu/>
                </SheetTrigger>

                <SheetContent side="left"> 
                    <SheetHeader>
                        <SheetTitle>
                            Medusa
                        </SheetTitle>
                    </SheetHeader>
                    
                    <nav class="flex flex-col items-start gap-4 px-4 py-4">
                        
                        <Button variant="ghost" class="text-left" onclick={
                            () => {
                                sheetIsOpen = false;
                                goto(`${base}/caftans`);
                            }
                        }>
                            <span class="text-2xl">
                                Caftans    
                            </span>
                        </Button>
                        <Button variant="ghost" class="text-left" onclick={
                            () => {
                                sheetIsOpen = false;
                                goto(`${base}/bookings`);
                            }
                        }>
                            <span class="text-2xl">
                                Bookings    
                            </span>
                        </Button>
                        <!-- <a
                            href="{base}/caftans"
                            class="hover:text-foreground/80 transition-colors"
                        >
                            Caftans
                        </a>
                        <a
                            href="{base}/bookings"
                            class="hover:text-foreground/80 transition-colors"
                        >
                            Bookings
                        </a> -->
                    </nav>
                </SheetContent>
            </Sheet>

            <a href="{base}/" class="flex items-center space-x-2">
                <span class="font-bold dark:text-white">
                    Medusa
                </span>
            </a>

            <nav class="hidden md:flex items-center gap-6 text-sm">
                <a
                    href="{base}/caftans"
                    class="hover:text-foreground/80 transition-colors"
                >
                    Caftans
                </a>
                <a
                    href="{base}/bookings"
                    class="hover:text-foreground/80 transition-colors"
                >
                    Bookings
                </a>
            </nav>
        </div>

        <div class="flex items-center space-x-2 pr-4">
            <NewBookingDialog />
            <Button onclick={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </div>
    </div>
</header>