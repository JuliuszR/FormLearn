'use client'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Imię musi mieć przynajmniej 2 znaki'),
  password: z.string().min(8, 'Hasło musi mieć przynajmniej 8 znakow')
})

export default function Page(){
  const form = useForm({
    defaultValues: {
      name: '',
      password: ''
    },
    onSubmit: async ({value}) => {
      const parsed = schema.safeParse(value)
      if (!parsed.success) {return}

      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
      })

      const data = await res.json()
      console.log(data)
    },
  })

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      form.handleSubmit()
    }}
    >
      <form.Field name='name'
      validators={{
        onBlur: ({ value })=>
          value.length < 2 ? 'Min 2 znaki' : undefined,
      }}
      children={(field) => (
        <div>
          <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur = {field.handleBlur}
          placeholder='Imię'
          />
          {field.state.meta.errors[0] && (<p style={{ color: 'red' }}>{field.state.meta.errors[0]}</p>)}
        </div>
      )}
      />
      <form.Field name='password'
      validators={{
        onBlur: ({ value })=> {
          if (value.length < 8) {
            return 'Min 8 znakow'
          }
          if (!/\d/.test(value)) {
            return 'Hasło musi zawierać co najmniej jedną cyfrę'
          }
          return undefined
        }
          
          
      }}
      children={(field) => (
        <div>
          <input
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur = {field.handleBlur}
          placeholder='Hasło'
          type='password'
          />
          {field.state.meta.errors[0] && <p style={{ color: 'red' }}>{field.state.meta.errors[0]}</p>
          }
        </div>
      )}
      />
    <button type="submit">Zarejestruj</button>
    </form>
  )
}