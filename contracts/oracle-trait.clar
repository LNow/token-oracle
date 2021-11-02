(use-trait nft-trait .nft-trait.nft-trait)
(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-trait token-oracle (
  (is-nft-trusted (<nft-trait>) (response bool uint))

  (is-ft-trusted (<ft-trait>) (response bool uint))
))