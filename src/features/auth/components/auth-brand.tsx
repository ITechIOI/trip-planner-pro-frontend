import { Box, Typography } from '@mui/material'
import appLogo from '@/assets/logos/app_logo.png'

export const AuthBrand = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '58px 1fr', md: '92px 1fr' },
        alignItems: 'center',
        columnGap: { xs: 1.25, md: 2 },
        color: '#ffffff',
        maxWidth: { xs: 320, md: 500 },
      }}
    >
      <Box
        component="img"
        src={appLogo}
        alt=""
        sx={{
          width: { xs: 58, md: 92 },
          height: { xs: 58, md: 92 },
          objectFit: 'contain',
        }}
      />

      <Box>
        <Typography
          sx={{
            fontSize: { xs: 24, md: 42 },
            lineHeight: 0.96,
            fontWeight: 800,
            color: '#0d2a59',
            whiteSpace: 'nowrap',
          }}
        >
          TRIP PLANNER
        </Typography>
        <Typography
          sx={{
            width: 'fit-content',
            fontSize: { xs: 26, md: 44 },
            lineHeight: 1,
            fontWeight: 800,
            color: '#1268ef',
            borderBottom: { xs: '4px solid #1268ef', md: '7px solid #1268ef' },
            pb: 0.3,
          }}
        >
          PRO
        </Typography>
      </Box>
    </Box>
  )
}
