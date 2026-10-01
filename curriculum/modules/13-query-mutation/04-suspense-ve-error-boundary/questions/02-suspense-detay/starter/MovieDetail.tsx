import { useSuspenseQuery } from '@tanstack/react-query'
import { Component, Suspense } from 'react'
import type { ReactNode } from 'react'
type Movie = { id: number; title: string }
type Props = { id: number; load: (id: number) => Promise<Movie> }
export function MovieDetail({ id, load }: Props) {
  void useSuspenseQuery
  void Component
  void Suspense
  void id
  void load
  return <section />
}
