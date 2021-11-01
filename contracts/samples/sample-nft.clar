(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONTRACT_ADDRESS (as-contract tx-sender))
(define-constant DEPLOYED_AT block-height)

(define-constant ERR_NOT_AUTHORIZED (err u1001))

(impl-trait .nft-trait.nft-trait)

(define-non-fungible-token nft uint)

(define-read-only (get-last-token-id)
  (ok u0)
)

(define-read-only (get-token-uri (id uint))
  (ok none)
)

(define-read-only (get-owner (id uint))
  (ok none)
)

(define-public (transfer (id uint) (from principal) (to principal))
  (ok true)
)