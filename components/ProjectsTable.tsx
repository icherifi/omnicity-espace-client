import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from './ui/badge'

function ProjectsTable() {
  return (
        <Tabs defaultValue="week">
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Projets</CardTitle>
                    <CardDescription>
                      {/* Recent orders from your store. */}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            ID bouquet
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            ID design
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Cout total
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Aide total
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Info projet
                          </TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className="bg-accent hover:cursor-pointer">
                          <TableCell>
                            <div className="font-medium">T4 Villeneuve</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                337 Centre Cial V Deux, 59650
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            #Oe31b70k
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            #Zk41b70H
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            45 873€
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">4700€</TableCell>
                          <TableCell className="hidden md:table-cell">
                            45 873€
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={"completed"} className="mt-4 mb-4 text-black">Terminé</Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className='hover:cursor-pointer'>
                          <TableCell>
                            <div className="font-medium">Studio Paris</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                                237 Rue des Pyrénées, 75020
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            #Oe31b70k
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            #Iek3Ml8p9
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            45 873€
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">4700€</TableCell>
                          <TableCell className="hidden md:table-cell">
                            45 873€
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={"completed"} className="mt-4 mb-4 text-black">Terminé</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
  )
}

export default ProjectsTable