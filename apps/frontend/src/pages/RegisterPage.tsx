import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../utils/errors'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      await registerUser(values)
      navigate('/leads', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create account</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        The first registered user becomes an admin.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-slate-900 underline dark:text-slate-100">
          Sign in
        </Link>
      </p>
    </div>
  )
}
