;; Ecosystem Management Contract

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INVALID_MODEL (err u101))
(define-constant ERR_INVALID_INTERACTION (err u102))

;; Data variables
(define-data-var model-count uint u0)
(define-data-var interaction-count uint u0)

;; Data maps
(define-map ecosystem-models
  uint
  {
    creator: principal,
    name: (string-ascii 64),
    description: (string-utf8 1024),
    universe-id: uint,
    complexity: uint,
    creation-time: uint,
    last-update: uint
  }
)

(define-map ecosystem-interactions
  uint
  {
    model-id: uint,
    interactor: principal,
    action: (string-ascii 64),
    impact: int,
    timestamp: uint
  }
)

;; Public functions
(define-public (create-ecosystem-model (name (string-ascii 64)) (description (string-utf8 1024)) (universe-id uint) (complexity uint))
  (let
    (
      (model-id (+ (var-get model-count) u1))
    )
    (map-set ecosystem-models
      model-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        universe-id: universe-id,
        complexity: complexity,
        creation-time: block-height,
        last-update: block-height
      }
    )
    (var-set model-count model-id)
    (ok model-id)
  )
)

(define-public (update-ecosystem-model (model-id uint) (description (string-utf8 1024)) (complexity uint))
  (let
    (
      (model (unwrap! (map-get? ecosystem-models model-id) ERR_INVALID_MODEL))
    )
    (asserts! (is-eq tx-sender (get creator model)) ERR_NOT_AUTHORIZED)
    (ok (map-set ecosystem-models
      model-id
      (merge model {
        description: description,
        complexity: complexity,
        last-update: block-height
      })
    ))
  )
)

(define-public (record-ecosystem-interaction (model-id uint) (action (string-ascii 64)) (impact int))
  (let
    (
      (interaction-id (+ (var-get interaction-count) u1))
    )
    (asserts! (is-some (map-get? ecosystem-models model-id)) ERR_INVALID_MODEL)
    (map-set ecosystem-interactions
      interaction-id
      {
        model-id: model-id,
        interactor: tx-sender,
        action: action,
        impact: impact,
        timestamp: block-height
      }
    )
    (var-set interaction-count interaction-id)
    (ok interaction-id)
  )
)

;; Read-only functions
(define-read-only (get-ecosystem-model (model-id uint))
  (map-get? ecosystem-models model-id)
)

(define-read-only (get-ecosystem-interaction (interaction-id uint))
  (map-get? ecosystem-interactions interaction-id)
)

(define-read-only (get-model-count)
  (var-get model-count)
)

(define-read-only (get-interaction-count)
  (var-get interaction-count)
)

