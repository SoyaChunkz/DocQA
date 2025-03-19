import { cn } from '@/lib/utils'
import { ExtendedMessage } from '../../types/messages'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { forwardRef } from 'react'

interface MessageProps {
  message: ExtendedMessage
  isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage,
        })}>
        <div
          className={cn(
            'relative flex h-6 w-6 aspect-square items-center justify-center',
            {
              'order-2 bg-green-600 rounded-sm':
                message.isUserMessage,
              'order-1 bg-zinc-800 rounded-sm':
                !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}>
          {message.isUserMessage ? (
            <Icons.user className='fill-zinc-200 text-zinc-200 h-3/4 w-3/4' />
          ) : (
            <Icons.logo className='fill-zinc-300 h-3/4 w-3/4' />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col space-y-2 text-base max-w-md mx-2',
            {
              'order-1 items-end': message.isUserMessage,
              'order-2 items-start': !message.isUserMessage,
            }
          )}>
          <div
            className={cn(
              'px-4 py-2 rounded-lg inline-block',
              {
                'bg-green-600 text-white':
                  message.isUserMessage,
                'bg-gray-200 text-gray-900':
                  !message.isUserMessage,
                'rounded-br-none':
                  !isNextMessageSamePerson &&
                  message.isUserMessage,
                'rounded-bl-none':
                  !isNextMessageSamePerson &&
                  !message.isUserMessage,
              }
            )}>
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose prose-sm max-w-none', {
                  'prose-invert text-zinc-50': message.isUserMessage,
                  'prose-neutral': !message.isUserMessage,
                })}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre className="bg-zinc-800 text-zinc-50 rounded-md p-2 overflow-x-auto" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-zinc-800 text-zinc-50 rounded-md p-1 font-mono text-sm" {...props} />
                  ),
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2" {...props} />,
                  li: ({ node, ...props }) => <li className="my-1" {...props} />,
                  p: ({ node, ...props }) => <p className="my-2" {...props} />,
                  a: ({ node, ...props }) => (
                    <a className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                }}>
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading-message' ? (
              <div
                className={cn(
                  'text-xs select-none mt-2 w-full text-right',
                  {
                    'text-zinc-500': !message.isUserMessage,
                    'text-green-300': message.isUserMessage,
                  }
                )}>
                {format(
                  new Date(message.createdAt),
                  'HH:mm'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'

export default Message