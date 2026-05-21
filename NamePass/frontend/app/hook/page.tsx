import React from "react";
import ReactDOM from "react-dom/client"
import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { TextField } from "@/ui/TextField";
import { z } from "zod";

const { fieldContext, formContext} = createFormHookContexts()

const { useAppForm } = createFormHook({
    fieldComponents:{
        TextField,
    },
    formComponents: {
    },
    fieldContext,
    formContext,
})