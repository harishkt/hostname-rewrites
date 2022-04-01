import Head from 'next/head'
import { useRouter } from 'next/router'
import { Layout, Page, Text, Link, List } from '@vercel/examples-ui'

export default function Index(props) {
  console.log(`props in Inde is ${JSON.stringify(props)}`);
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Page>
        <Text variant="h1" className="mb-6">
          Loading...
        </Text>
      </Page>
    )
  }

  return (
    <Page>
      <Head>
        <title>{props.name} - Vercel Edge Functions</title>
        <meta itemProp="description" content={props.description} />
      </Head>
      <Text variant="h1" className="mb-6">
        {props.name}
      </Text>
      <div className="mb-4">
        <Link className="mr-2.5" href="/">
          Home
        </Link>
        <Link href="/about">About</Link>
      </div>
      <Text variant="h2" className="mb-6">
        More examples:
      </Text>
      <List>
        <li>
          <Link href="https://hostname-rewrites-gamma.vercel.app">
            hostname-rewrites-gamma.vercel.app
          </Link>
        </li>
        <li>
          <Link href="https://hostname-rewrites-beta.vercel.app">
            hostname-rewrites-beta.vercel.app
          </Link>
        </li>
        <li>
          <Link href="https://hostname-rewrites-theta.vercel.app">
            hostname-rewrites-theta.vercel.app
          </Link>
        </li>
        <li>
          <Link href="https://custom-domain-1.com">custom-domain-1.com</Link>{' '}
          (maps to{' '}
          <Link href="https://hostname-rewrites-gamma.vercel.app">
            hostname-rewrites-gamma.vercel.app
          </Link>
          )
        </li>
      </List>
    </Page>
  )
}

Index.Layout = Layout

const mockDB = [
  {
    name: 'Site 1',
    description: 'Subdomain + custom domain',
    subdomain: 'hostname-rewrites-gamma',
    customDomain: 'custom-domain-1.com',
  },
  {
    name: 'Site 2',
    description: 'Subdomain only',
    subdomain: 'hostname-rewrites-theta',
    customDomain: null,
  },
  {
    name: 'Site 3',
    description: 'Subdomain only',
    subdomain: 'hostname-rewrites-beta',
    customDomain: null,
  },
]

export async function getStaticPaths() {
  // get all sites that have subdomains set up
  const subdomains = mockDB.filter((item) => item.subdomain)

  // get all sites that have custom domains set up
  const customDomains = mockDB.filter((item) => item.customDomain)

  // build paths for each of the sites in the previous two lists
  const paths = [
    ...subdomains.map((item) => {
      return { params: { site: item.subdomain } }
    }),
    ...customDomains.map((item) => {
      return { params: { site: item.customDomain } }
    }),
  ]
  console.log(`paths are ${JSON.stringify(paths)}`)
  return {
    paths: paths,
    fallback: true, // fallback true allows sites to be generated using ISR
  }
}

export async function getStaticProps(x) {
  console.log(`x in getStaticProps is ${JSON.stringify(x)}`)
  const { params: { site } } = x
  console.log(`Inside getStaticProps site is ${site}`);
  // check if site is a custom domain or a subdomain
  const customDomain = site.includes('.') ? true : false

  // fetch data from mock database using the site value as the key
  const data = mockDB.filter((item) =>
    customDomain ? item.customDomain == site : item.subdomain == site
  )

  return {
    props: { ...data[0] },
    revalidate: 3600, // set revalidate interval of 1h
  }
}
