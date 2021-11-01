(define-constant CONTRACT_OWNER tx-sender)
(define-constant CONTRACT_ADDRESS (as-contract tx-sender))
(define-constant DEPLOYED_AT block-height)

(define-constant ERR_NOT_AUTHORIZED (err u1001))

(use-trait nft-trait .nft-trait.nft-trait)
(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-map NftContracts
  principal
  bool
)

(define-map FtContracts
  principal
  bool
)

(define-read-only (is-nft-trusted (nft <nft-trait>))
  (default-to false (map-get? NftContracts (contract-of nft)))
)

(define-public (add-nft (nft <nft-trait>) (isTrusted bool))
  (begin
    (asserts! (is-eq contract-caller CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (map-set NftContracts (contract-of nft) isTrusted)
    (ok true)
  )
)

(define-read-only (is-ft-trusted (ft <ft-trait>))
  (default-to false (map-get? FtContracts (contract-of ft)))
)

(define-public (add-ft (ft <ft-trait>) (isTrusted bool))
  (begin
    (asserts! (is-eq contract-caller CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (map-set FtContracts (contract-of ft) isTrusted)
    (ok true)
  )
)