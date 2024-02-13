import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Header } from './Header'
import { BackButton } from './BackButton'
import { CardWrapper } from './CardWrapper'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const ErrorCard = () => {
  return (
    <CardWrapper headerLabel='Opps! Something went wrong!' backButtonHref='/auth/login' backButtonLabel='Back to login'>
        <div className="w-full flex justify-center items-center">
            <ExclamationTriangleIcon className='text-destructive'/>
        </div>
    </CardWrapper>
  )
}

export default ErrorCard
