"use client";

import React, { useState } from 'react';
import { useMetro } from '@/lib/context/metro-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineForm } from './LineForm';

export const LinesList: React.FC = () => {
  const { lines, deleteLine, setActiveLine, activeLineId } = useMetro();
  const [editingLine, setEditingLine] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);

  const handleEditLine = (lineId: string) => {
    setEditingLine(lineId);
    setIsFormOpen(true);
  };

  const handleDeleteLine = (lineId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteLine(lineId);
  };

  const handleLineClick = (lineId: string) => {
    setActiveLine(activeLineId === lineId ? null : lineId);
  };

  const lineToEdit = lines.find(line => line.id === editingLine);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lines</CardTitle>
        <Button size="sm" onClick={() => setIsAddLineOpen(true)}>
          Add Line
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {lines.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No lines added yet. Click &quot;Add Line&quot; to create a new line.
            </div>
          ) : (
            lines.map(line => (
              <div
                key={line.id}
                className={`p-3 border rounded-md flex justify-between items-center cursor-pointer ${
                  activeLineId === line.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => handleLineClick(line.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: line.color }}
                  />
                  <div>
                    <div className="font-medium">{line.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {line.id} | Stations: {line.stations.length}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLine(line.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDeleteLine(line.id, e)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {activeLineId ? (
            <p>
              Click on stations to add them to the selected line.
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => setActiveLine(null)}
              >
                Cancel
              </Button>
            </p>
          ) : (
            <p>Select a line to add stations to it.</p>
          )}
        </div>
      </CardContent>

      {lineToEdit && (
        <LineForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          initialValues={lineToEdit}
          isEditing={true}
        />
      )}

      <LineForm
        open={isAddLineOpen}
        onOpenChange={setIsAddLineOpen}
        isEditing={false}
      />
    </Card>
  );
}; 