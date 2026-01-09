import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

const TeamPerformance = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Team Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Total Calls</TableCell>
                <TableCell align="right">Answered</TableCell>
                <TableCell align="right">Avg Duration</TableCell>
                <TableCell align="right">Conversion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((member) => (
                  <TableRow key={member.user.id}>
                    <TableCell>{member.user.full_name}</TableCell>
                    <TableCell align="right">{member.totalCalls}</TableCell>
                    <TableCell align="right">{member.answeredCalls}</TableCell>
                    <TableCell align="right">{Math.floor(member.avgDuration / 60)}m</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${member.conversionRate}%`}
                        color={member.conversionRate > 20 ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;
