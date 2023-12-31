"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useStore} from "@/components/rpg/store";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {BuildMapping} from "@/app/api/builds/route";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export interface FormProps {
    builds: BuildMapping;
    onSubmit: () => void;
}

const formSchema = z.object({
    name: z.string({required_error: "Please enter a name"}).min(3, {
        message: "Name must be at least 3 characters"
    }).max(20, {
        message: "Name cannot be longer than 20 characters",
    }),
    build: z.union([
        z.literal('thief'),
        z.literal('knight'),
        z.literal('mage'),
        z.literal('brigadier'),
    ], {required_error: "Please select a character build"})
})

export function CharacterForm(props: FormProps) {
    const [disabled, setDisabled] = useState<boolean>(false);
    const setName = useStore(state => state.setName);
    const setBuild = useStore(state => state.setBuild);
    const setStats = useStore(state => state.setStats);

    const form = useForm<z.infer<typeof formSchema>>({
        // @ts-ignore
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            build: "thief",
        },
    });

    function onSubmitHandler(values: z.infer<typeof formSchema>) {
        props.onSubmit();
        setDisabled(true);
    }

    return (
        <Card data-testid={"character-card"} className={"w-full"}>
            <CardHeader>
                <CardTitle>Choose a name and build</CardTitle>
                <CardDescription>Be whatever you want to be, choose your path wisely</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className={"w-full lg:w-1/2 space-y-3"} onSubmit={form.handleSubmit(onSubmitHandler)}>
                        <fieldset disabled={disabled} className={"space-y-3"}>
                            <FormField
                                control={form.control}
                                name={"name"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Character name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={"Galactic space lord"} {...field} onChange={(event) => {
                                                field.onChange(event);
                                                setName(event.target.value);
                                            }}/>
                                        </FormControl>
                                        <FormDescription>
                                            Your display name
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={"build"}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Build</FormLabel>
                                        <Select disabled={disabled} onValueChange={value => {
                                            field.onChange(value);
                                            setBuild(value);
                                            const {strength, agility, wisdom, magic} = props.builds[value];
                                            setStats(strength, agility, wisdom, magic);
                                        }} defaultValue={"thief"}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a build!"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="thief">Thief</SelectItem>
                                                <SelectItem value="knight">Knight</SelectItem>
                                                <SelectItem value="mage">Mage</SelectItem>
                                                <SelectItem value="brigadier">Brigadier</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            Select your character&apos;s build
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </fieldset>
                        <Button disabled={disabled} className={"justify-self-end"}>Start!</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}