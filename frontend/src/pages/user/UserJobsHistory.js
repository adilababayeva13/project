import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import CardElement from '../../component/CardElement'

const UserJobsHistory = () => {
  const { user } = useSelector((state) => state.userProfile)

  console.log('jobs', user?.jobsHistory)

  return (
    <>
      <Box>
        <Typography variant="h4" sx={{ color: '#fafafa' }}>
          {' '}
          Jobs History
        </Typography>
        <Box>
          {user &&
            user.jobsHistory.map((history, i) => (
              <CardElement
                key={i}
                id={history._id}
                jobTitle={history.title}
                description={history.description}
                category=""
                location={history.location}
                applicationStatus={history.applicationStatus}
              />
            ))}
        </Box>
      </Box>
    </>
  )
}

export default UserJobsHistory
