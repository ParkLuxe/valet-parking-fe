/**
 * Reusable Card Component
 * Wraps Material-UI Card with consistent styling
 */

import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
} from '@mui/material';

const Card = ({
  title,
  subtitle,
  children,
  actions,
  headerAction,
  elevation = 1,
  sx = {},
  ...props
}) => {
  return (
    <MuiCard elevation={elevation} sx={{ height: '100%', ...sx }} {...props}>
      {(title || subtitle || headerAction) && (
        <>
          <CardHeader
            title={title}
            subheader={subtitle}
            action={headerAction}
            sx={{ pb: 1 }}
          />
          <Divider />
        </>
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        {children}
      </CardContent>
      
      {actions && (
        <>
          <Divider />
          <CardActions>
            {actions}
          </CardActions>
        </>
      )}
    </MuiCard>
  );
};

export default Card;
