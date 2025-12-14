/**
 * Host User Management Page
 * Manage valets and valet managers (host users)
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const HostUserManagement = () => {
  const { valetList } = useSelector((state) => state.valets);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" fontWeight="bold">
            Host User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage valets and valet managers
          </Typography>
        </div>
        <Button startIcon={<AddIcon />}>
          Add Host User
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {valetList.length > 0 ? (
                valetList.map((valet) => (
                  <TableRow key={valet.id}>
                    <TableCell>{valet.name}</TableCell>
                    <TableCell>{valet.email}</TableCell>
                    <TableCell>{valet.phone}</TableCell>
                    <TableCell>{valet.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={valet.isActive ? 'Active' : 'Inactive'}
                        color={valet.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No host users found. Add your first valet or valet manager.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Container>
  );
};

export default HostUserManagement;
