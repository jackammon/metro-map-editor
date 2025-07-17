"use client";

import React, { useMemo } from 'react';
import { useMapEditor } from '@/lib/context/map-editor-context';
import { validateMap, ValidationError } from '@/lib/utils/validation-utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const SeverityIcon = ({ severity }: { severity: ValidationError['severity'] }) => {
    switch (severity) {
        case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
        case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        case 'info': return <Info className="h-4 w-4 text-blue-500" />;
    }
}

export const ValidationPanel: React.FC = () => {
  const { gameMap } = useMapEditor();
  
  const validationErrors = useMemo(() => {
    if (!gameMap) return [];
    return validateMap(gameMap);
  }, [gameMap]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
            <span>Validation Status</span>
            {validationErrors.length === 0 ? 
                <CheckCircle className="h-5 w-5 text-green-500" /> :
                <AlertTriangle className="h-5 w-5 text-red-500" />
            }
        </CardTitle>
        <CardDescription>
            {validationErrors.length} issue(s) found.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validationErrors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No issues detected. Map is valid!</p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm p-2 rounded-md bg-muted/50">
                <SeverityIcon severity={error.severity} />
                <div>
                    <p>{error.message}</p>
                    {error.relatedId && (
                        <Badge variant="secondary" className="mt-1">
                            ID: {error.relatedId}
                        </Badge>
                    )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}; 