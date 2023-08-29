import useSWRImmutable from 'swr/immutable'
import { ProposalState, Proposal } from 'state/types'
import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'

export const getCoreProposal = async (type: ProposalState): Promise<Proposal[]> => {
  const response = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!, $admins: [String]!) {
        proposals(first: $first, skip: $skip, where: { author_in: $admins, space_in: "", state: $state }) {
          id
        }
      }
    `,
    { first: 1, skip: 0, state: type, admins: 'ADMINS' },
  )
  return response.proposals
}

export const useVotingStatus = () => {
  const { data: votingStatus = null } = useSWRImmutable('anyActiveSoonCoreProposals', async () => {
    const activeProposals = await getCoreProposal(ProposalState.ACTIVE)
    if (activeProposals.length) {
      return 'vote_now'
    }
    const soonProposals = await getCoreProposal(ProposalState.PENDING)
    if (soonProposals.length) {
      return 'soon'
    }
    return null
  })
  return votingStatus
}
