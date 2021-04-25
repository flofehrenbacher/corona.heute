import { getCurrentRKIData } from 'hooks/use-current-rki-data'
import * as fs from 'fs'

main()

async function main() {
  try {
    const data = await getCurrentRKIData()
    fs.writeFileSync(
      'src/development-data.ts',
      `export const developmentData = ${JSON.stringify(data)}`,
    )
    console.log('Done 🚀')
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
  }
}
