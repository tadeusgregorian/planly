//@flow
import { getFBPath } from './actionHelpers'
import type { Position } from 'types/index'
import { db } from './firebaseInit'

export function savePositionToDB(position: Position) {
	db().ref(getFBPath('positions')).child(position.id).set(position)
}

export const rearrangePositions = (order: Array<{id: string, nr: number}>) => {
	const updates = {}
	order.forEach(o => updates[getFBPath('positions', [ o.id,'nr'])] = o.nr )
	db().ref().update(updates)
}
