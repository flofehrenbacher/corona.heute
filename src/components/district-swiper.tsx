import { List, ListItem, ListProps } from '@chakra-ui/react'
import { AGS } from 'hooks/use-current-rki-data'

import { DistrictCard } from './district-card'

interface DistrictSwiperProps extends ListProps {
  districts: AGS[]
}
export function DistrictList({ districts, ...props }: DistrictSwiperProps) {
  return (
    <List {...props}>
      {districts.map((ags, i) => (
        <ListItem key={ags} mt={i !== 0 ? 4 : 0}>
          <DistrictCard key={ags} ags={ags} flexShrink={0} />
        </ListItem>
      ))}
    </List>
  )
}
