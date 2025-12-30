/**
 * Host User Management Page - Enhanced
 * Comprehensive user management with search, filters, and performance metrics
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type {  RootState  } from '../redux';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Award,
  Circle,
  Filter,
} from 'lucide-react';
import { Card, Button, Modal, Input } from '../components';
import { cn, getInitials } from '../utils';
import { useHostUsers } from '../hooks/queries/useHostUsers';

const HostUserManagement = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const hostId = (user as any)?.hostId || '';
  const { data: valetList = [] } = useHostUsers(hostId);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return (valetList || [])?.filter((user) => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.hostName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    }).sort((a, b) => {
      return a.firstName.localeCompare(b.firstName);
    });
  }, [valetList, searchQuery]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Get role badge colors
  const getRoleBadge = (role) => {
    const badges = {
      valet: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Valet' },
      valet_head: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Manager' },
      host: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Host' },
    };
    return badges[role] || badges.valet;
  };

  // Mock performance score (would come from backend) - using deterministic values based on index
  const getPerformanceScore = (index) => 70 + ((index * 7) % 30);
  const getOnlineStatus = (index) => index % 3 !== 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            Host User Management
          </h1>
          <p className="text-white/70">
            Manage valets, managers, and their performance
          </p>
        </div>
        <Button
          variant="gradient"
          className="flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5" />
          Add Host User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Users', value: valetList?.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active', value: valetList?.filter(u => u.isActive).length, color: 'from-green-500 to-emerald-500' },
          { label: 'Valets', value: valetList?.filter(u => u.role === 'valet').length, color: 'from-purple-500 to-pink-500' },
          { label: 'Managers', value: valetList?.filter(u => u.role === 'valet_head').length, color: 'from-orange-500 to-red-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-10',
                stat.color
              )} />
              <div className="relative p-6">
                <p className="text-white/70 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <div className="p-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-button text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/50" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-button text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Roles</option>
              <option value="valet">Valet</option>
              <option value="valet_head">Manager</option>
              <option value="host">Host</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table/Grid */}
      <Card>
        <div className="p-6">
          {paginatedUsers.length > 0 ? (
            <div className="space-y-4">
              {paginatedUsers.map((user, index) => {
                const roleBadge = getRoleBadge(user.roleName);
                const performanceScore = getPerformanceScore(index);
                const isOnline = getOnlineStatus(index);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                        {getInitials(user.firstName)}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0">
                        <Circle
                          className={cn(
                            'w-5 h-5',
                            isOnline ? 'text-green-500 fill-green-500' : 'text-gray-500 fill-gray-500'
                          )}
                        />
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">{user.firstName} {user.lastName}</h4>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          roleBadge.bg,
                          roleBadge.text
                        )}>
                          {roleBadge.label}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          user.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        )}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </div>
                    </div>

                    {/* Performance Score */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-white/50 text-xs mb-1">Performance</p>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-semibold">{performanceScore}%</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-button hover:bg-white/5 transition-colors">
                          <Edit className="w-5 h-5 text-blue-400" />
                        </button>
                        <button className="p-2 rounded-button hover:bg-white/5 transition-colors">
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/50 mb-4">No users found</p>
              <Button variant="gradient" onClick={() => setShowAddModal(true)}>
                Add Your First User
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-button bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-white/70">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-button bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Host User"
        >
          <div className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" required />
            <Input label="Email" type="email" placeholder="john@example.com" required />
            <Input label="Phone" placeholder="+919876543210" required />
            <Input
              select
              label="Role"
              required
            >
              <option value="valet">Valet</option>
              <option value="valet_head">Valet Manager</option>
            </Input>
            <div className="flex gap-3 pt-4">
              <Button variant="gradient" className="flex-1">
                Add User
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HostUserManagement;
