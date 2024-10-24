import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>

        <div className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:bg-gray-300 hover:bg-white/50'>
          <p className='text-sm font-semibold text-gray-700'>DocQA is now live!!</p>
        </div>

        <h1 className='max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl'>
          Generate QNA or CHAT with your{' '}
          <span className='text-green-600'>documents</span>{' '}
          in seconds.
        </h1>

        <ul className='mt-5 max-w-prose text-zinc-700 sm:text-lg list-none'>
          
          <li>DocQA allows you to generate QnA's from any PDF document.</li>
          <li>You can also ask any specific questions or chat with your pdf.</li>
          <li>Simply upload your file and start generating right away.</li>

        </ul>

        {/* <Link
          className={buttonVariants({
            size: 'lg',
            className: 'mt-5',
          })}
          href='/dashboard'
          target='_blank'>
          Get started{' '}
          <ArrowRight className='ml-2 h-5 w-5' />
        </Link> */}

      </MaxWidthWrapper>

      {/* value proposition section */}
      <div>

        <div className='relative isolate'>

          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fb80ff] to-[#89f4fc] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            />
          </div>

          <div>
            <div className='mx-auto max-w-6xl px-6 lg:px-8'>
              <div className='mt-16 flow-root sm:mt-24'>
                <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                  <Image
                    src='/qna_preview.png'
                    alt='product preview'
                    width={1364}
                    height={866}
                    quality={100}
                    className='rounded-md bg-white p-2 sm:p-4 md:p-6 shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
          </div>



          <div className='mb-12 mt-20 px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
                Beautiful UI/UX
              </h2>
            </div>
          </div>
          

          
          <div>
            <div className='mx-auto max-w-6xl px-6 lg:px-8'>
              <div className='mt-16 flow-root sm:mt-24'>
                <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
                  <Image
                    src='/dashboard_preview.png'
                    alt='product preview'
                    width={1364}
                    height={866}
                    quality={100}
                    className='rounded-md bg-white p-2 sm:p-4 md:p-6 shadow-2xl ring-1 ring-gray-900/10'
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80ffaa] to-[#89e1fc] opacity-45 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
            />
          </div>
          
        </div>

      </div>

      {/* Feature section */}
      <div className='mx-auto mb-32 mt-28 max-w-5xl sm:mt-32'>

        <div className='mb-12 px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl sm:text-center'>
            <h2 className='mt-2 font-bold text-4xl text-gray-900 sm:text-5xl'>
            Interacting with your PDF files has never been
            easier than with DocQA.
            </h2>
          </div>
        </div>

        <div className='mb-12 px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl sm:text-center'>
              <p className='mt-4 text-lg text-gray-600'>
                Follow these steps to get started
              </p>
            </div>
          </div>
        
        

        {/* steps */}
        <ol className='my-8 mx-1 md:mx-10 space-y-8 pt-8 md:flex md:space-x-14 md:space-y-0'>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-3 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-green-600'>
                <span className='border-2 border-green-600 rounded-md p-1'>STEP 1</span>
              </span>
              <span className='text-xl md:text-2xl font-semibold'>
                Sign up for an account
              </span>
              <span className='mt-2 text-zinc-700'>
                Either starting out with a free plan or
                choose our{' '}
                <Link
                  href='/pricing'
                  className='text-green-700 underline underline-offset-2'>
                  pro plan
                </Link>
                .
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-3 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-green-600'>
                <span className='border-2 border-green-600 rounded-md p-1'>STEP 2</span>
              </span>
              <span className='text-xl md:text-2xl font-semibold'>
                Upload your PDF file
              </span>
              <span className='mt-2 text-zinc-700'>
                We&apos;ll process your file and make it
                ready for you to started with.
              </span>
            </div>
          </li>
          <li className='md:flex-1'>
            <div className='flex flex-col space-y-3 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4'>
              <span className='text-sm font-medium text-green-600'>
                <span className='border-2 border-green-600 rounded-md p-1'>STEP 3</span>
              </span>
              <span className='text-xl md:text-2xl font-semibold'>
                Start asking questions
              </span>
              <span className='mt-2 text-zinc-700'>
                It&apos;s that simple. Try out DocQA today -
                it really takes less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 flow-root sm:mt-24'>
            <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
              <Image
                src='/file-upload-preview.jpg'
                alt='uploading preview'
                width={1419}
                height={732}
                quality={100}
                className='rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10'
              />
            </div>
          </div>
        </div>

      </div>
    </>


  );
}
